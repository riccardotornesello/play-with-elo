export function convertResponseToFormError(response: any) {
  const errors: { [key: string]: string[] } = {};

  response.forEach((issue: any) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });

  // Convert the arrays to strings
  const output: { [key: string]: string } = {};
  Object.keys(errors).forEach((key) => {
    output[key] = errors[key].join(', ');
  });

  return output;
}
