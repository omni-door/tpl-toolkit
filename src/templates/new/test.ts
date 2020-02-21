export default function (config: {
  componentName: string;
}) {
  const { componentName } = config;

  return `import 'mocha'
import { expect } from 'chai'
import ${componentName} from '../'

describe("${componentName} test", function () {
  it('${componentName} is a function', function () {
    expect(${componentName}).to.be.a('function')
  })
})`;

}

