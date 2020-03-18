export default function (config: {
  name: string;
  configFileName: string;
}) {
  const { name, configFileName } = config;

  return `# ${name}

## Run your project

\`\`\`shell
npm start
\`\`\`
or
\`\`\`shell
npm run dev
\`\`\`

## Create a tool by the template

\`\`\`shell
npm run new [toolName]
\`\`\`

## Build your project

\`\`\`shell
npm run build
\`\`\`

### Ignore pre-check
\`\`\`shell
npm run build -- -n
\`\`\`

## Release your project

\`\`\`shell
npm run release
\`\`\`

### Ignore automatic iteration of version
\`\`\`shell
npm run release -- -i
\`\`\`

### Manual iteration of version
\`\`\`shell
npm run release -- -m 0.3.25
\`\`\`

### Ignore pre-check
\`\`\`shell
npm run release -- -n
\`\`\`

**More powerful customizations is in [${configFileName}]**
`;
}

