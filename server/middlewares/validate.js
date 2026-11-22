import { ZodError } from 'zod';

const validate = (schema) => {
    return (req, res, next) => {
        try {
            const validatedData = schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });

            // Preserve Zod transformations on the request body.
            if (validatedData.body !== undefined) {
                req.body = validatedData.body;
            }
            if (validatedData.params !== undefined) {
                req.params = validatedData.params;
            }
            if (validatedData.query !== undefined) {
                req.query = validatedData.query;
            }

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: 'Please check the submitted information.',
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }))
                });
            }

            next(error);
        }
    };
};

export default validate;
