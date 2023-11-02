
function makeBody(req, res, next){
    if ((req.method !== 'POST') && (req.method !== 'PATCH')) { return next() }
    if (req.headers['content-type'] !== 'application/json') { return next() }
    let bodyTemp = ''
    req.on('data', (chunk) => {
        bodyTemp += chunk.toString()
    })
    req.on('end', () => {
        req.body = JSON.parse(bodyTemp)
        next()
    })
   } 

   export default makeBody