export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

  return `export function ${componentName} () {}

export default ${componentName};`;
}