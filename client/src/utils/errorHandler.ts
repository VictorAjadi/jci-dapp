/**
 * A higher-order function to handle errors in asynchronous functions.
 *
 * @param {Function} func - The async function to wrap.
 * @returns {Function} - A wrapped function with enhanced error handling.
 */
export const ErrorHandler = <T extends (...args: any[]) => Promise<any>>(func: T) => {
  return async (...args: Parameters<T>) => {
    try {
      // Call the original function with arguments and return its result
      return await func(...args);
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      
      if (error.response) {
        errorMessage = error.response?.data?.message || 'An unknown error occurred';
      } else if (error.request) {
        errorMessage = 'No response from the server. Please check your network connection.';
      } else {
        errorMessage = 'Session token has expired, please login.';
      }
      return {
        status: error.response?.data?.status || 'error',
        message: errorMessage,
      };
    }
  };
};
