const appResponse = (req, res, next) => {
    res.responseData = (statusCode, data) => {
        res.status(statusCode).json(data);
    }

    res.success = (data) => {
        res.responseData(200, data);
    }

    res.created = (data) => {
        res.responseData(201, data);
    }

    res.deleted = (data) => {
        res.responseData(204, data);
    }

    res.errorClient = (msg) => {
        res.responseData(400, { success: false, message: msg })
    }

    res.unauthorized = () => {
        res.responseData(401, { success: false, message: 'Xác thực không thành công!' })
    }

    res.forbidden = () => {
        res.responseData(403, { success: false, message: 'Không được phép!' })
    }

    res.notFound = (message) => {
        res.responseData(404, { success: false, message: message })
    }

    res.error = (err) => {
        res.responseData(500, { success: false, message: err.message });
    }

    next();
}

module.exports = appResponse;