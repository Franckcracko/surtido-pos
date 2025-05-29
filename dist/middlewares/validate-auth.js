export const validateAuthMiddleware = (req, res, next) => {
    const user = req.session?.user;
    if (!user) {
        res.status(401).redirect('/');
        return;
    }
    next();
};
