const client = require("prom-client");

// Create a Registry
const register = new client.Registry();

// Collect default Node.js metrics
client.collectDefaultMetrics({
  register,
  prefix: "cab_booking_",
});

// ================================
// HTTP Request Counter
// ================================
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"],
});

// ================================
// HTTP Request Duration
// ================================
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [
    0.005,
    0.01,
    0.025,
    0.05,
    0.1,
    0.25,
    0.5,
    1,
    2,
    5,
  ],
});

// ================================
// Active Requests Gauge
// ================================
const activeRequests = new client.Gauge({
  name: "active_requests",
  help: "Number of active HTTP requests",
});

// ================================
// Node.js Heap Memory
// ================================
const heapUsed = new client.Gauge({
  name: "nodejs_heap_used_bytes",
  help: "Node.js heap memory used",
});

const heapTotal = new client.Gauge({
  name: "nodejs_heap_total_bytes",
  help: "Node.js heap memory total",
});

// ================================
// Process Memory
// ================================
const rssMemory = new client.Gauge({
  name: "process_resident_memory_bytes",
  help: "Resident memory size in bytes",
});

// ================================
// Process Uptime
// ================================
const uptimeGauge = new client.Gauge({
  name: "process_uptime_seconds",
  help: "Node.js process uptime",
});

// ================================
// Event Loop Lag
// ================================
const eventLoopLag = new client.Gauge({
  name: "nodejs_event_loop_lag_seconds",
  help: "Node.js event loop lag",
});

// Register metrics
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
register.registerMetric(activeRequests);
register.registerMetric(heapUsed);
register.registerMetric(heapTotal);
register.registerMetric(rssMemory);
register.registerMetric(uptimeGauge);
register.registerMetric(eventLoopLag);

// Update gauges every 5 seconds
setInterval(() => {
  const mem = process.memoryUsage();

  heapUsed.set(mem.heapUsed);
  heapTotal.set(mem.heapTotal);
  rssMemory.set(mem.rss);

  uptimeGauge.set(process.uptime());

  const start = process.hrtime();

  setImmediate(() => {
    const diff = process.hrtime(start);
    const lag = diff[0] + diff[1] / 1e9;
    eventLoopLag.set(lag);
  });
}, 5000);

// =====================================
// Metrics Middleware
// =====================================
const metricsMiddleware = (req, res, next) => {
  activeRequests.inc();

  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    activeRequests.dec();

    const route =
      req.route?.path ||
      req.baseUrl + req.path ||
      req.originalUrl ||
      "unknown";

    httpRequestCounter.inc({
      method: req.method,
      route,
      status: res.statusCode,
    });

    end({
      method: req.method,
      route,
      status: res.statusCode,
    });
  });

  next();
};

module.exports = {
  register,
  metricsMiddleware,
};