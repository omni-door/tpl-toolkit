import { describe, it } from 'mocha';
import { expect } from 'chai';
import source_html from '../html';
import source_index_react from '../index_react';
import webpack_dev from '../webpack_dev';

describe('source_html template test', function () {
  it('type checking', function () {
    expect(source_html).to.be.a('function');
  });
});

describe('source_index_react template test', function () {
  it('type checking', function () {
    expect(source_index_react).to.be.a('function');
  });
});

describe('webpack_dev template test', function () {
  it('type checking', function () {
    expect(webpack_dev).to.be.a('function');
  });
});