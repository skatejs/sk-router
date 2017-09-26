/** @jsx h */

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';
import cases from 'jest-in-case';

import { Link } from '../src';

cases('render', dom => {
  return mount(dom).wait(w => {
    expect(w.node.innerHTML).toMatchSnapshot();
  });
}, [
  <Link />,
  <Link href="/test" />
]);
