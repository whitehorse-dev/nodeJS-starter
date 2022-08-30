const fs = require('fs')

const requestHandler = (req, res) => {
  const url = req.url
  const method = req.method

  if (url === '/') {
    res.write('<html>')
    res.write('<head><title>Enter the Message</title></head>')
    res.write('<body><h1>You will send a message to next screen</h1></body>')
    res.write(
      '<body><form action="/message" method="POST"><input name ="inputName" type="text"></input><button type = "submit"></button></form></body>'
    )
    res.write('</html>')
    return res.end()
  }

  if (url === '/message' && method === 'POST') {
    const requestBody = []
    req.on('data', (chunk) => {
      console.log(`Data entered in the chunk is ${chunk}`)
      requestBody.push(chunk)
    })

    return req.on('end', () => {
      const parsedBody = Buffer.concat(requestBody).toString()
      const message = parsedBody.split('=')[1]
      console.log(message)
      const writeFile = fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302
        res.setHeader('Location', '/')
        res.writeHead(302, {})
        return res.end()
        // THis is the event driven architecture. ie OnEnd - start filling the message body. Write to file and then error 3 things at queue.
        // 3 Events and output will be driven by the results of earlier functions.
      })
    })
  }

  res.setHeader('Content-Type', 'text/html')
  res.write('<html>')
  res.write('<head><title>Hello Saurabh Pandey</title></head>')
  res.write('<body><h1>Hello Saurabh Pandey in Body in the server</h1></body>')
  res.write('</html>')
  res.end()
}

module.exports = requestHandler
