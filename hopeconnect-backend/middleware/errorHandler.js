exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    // Default to 500 server error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        error: message
    });
};

exports.notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Resource not found'
    });
};