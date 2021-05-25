const isWhat = (module) => {
    return function (req, res, next) {
        try {
            if(req.user.type === module){
                return next()
            }
            return res.status(401).send({error: 'You do not have access to this route'})
        } catch (error) {
            return res.status(401).send({error})
        }
        
    }
}

module.exports = isWhat