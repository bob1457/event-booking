const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    console.log('auth', authHeader);

    if(!authHeader){
        req.isAuth = false;
        next();
    } 
    else {
        const token = authHeader.split(' ')[1];
        console.log('token', token);
        
        if(!token || token.length === ''){
            req.isAuth = false;
            next();
        }

        let decodedToken;
        try{
            decodedToken = jwt.verify(token, 'somesupersecretkey');
            console.log('decodedToken', decodedToken);
            req.isAuth = true;
            req.userId = decodedToken.userId;
            next();
        } catch(err){
            req.isAuth = false;
            next();
        }

        if(!decodedToken){
            req.isAuth = false;
            next();
        }
    }
    // const token = authHeader.split(' ')[1];
    //     console.log('token', token);
        
    //     if(!token || token.length === ''){
    //         req.isAuth = false;
    //         next();
    //     }

    //     let decodedToken;
    //     try{
    //         decodedToken = jwt.verify(token, 'somesupersecretkey');
    //         console.log('decodedToken', decodedToken);
    //         req.isAuth = true;
    //         req.userId = decodedToken.userId;
    //         next();
    //     } catch(err){
    //         req.isAuth = false;
    //         next();
    //     }

    //     if(!decodedToken){
    //         req.isAuth = false;
    //         next();
    //     }
    
    
    // req.isAuth = true;
    // req.userId = decodedToken.userId;
    // next();

        
    

    
};