process.stdout.write(`${JSON.stringify({ ready: true, pid: process.pid })}\n`)
setInterval(() => {}, 1_000)
