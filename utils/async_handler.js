export function asyncHandler(fn) {
  return async (request, response, next) => {
    try {
      return await Promise.resolve(fn(request, response, next));
    } catch (error) {
      response.render('error', { error });
    }
  };
}
