import { expect } from 'chai';
import { h, render } from 'preact';
import PropertiesForm from 'settings/components/form/properties-form'

describe("settings/form/PropertiesForm", () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  describe('render', () => {
    it('renders PropertiesForm', () => {
      let types = {
        mystr: 'string',
        mynum: 'number',
        mybool: 'boolean',
        empty: 'string',
      }
      let value = {
        mystr: 'abc',
        mynum: 123,
        mybool: true,
      };
      render(<PropertiesForm types={types} value={value} />, document.body);

      let strInput = document.querySelector('input[name=mystr]');
      let numInput = document.querySelector('input[name=mynum]');
      let boolInput = document.querySelector('input[name=mybool]');
      let emptyInput = document.querySelector('input[name=empty]');

      expect(strInput.type).to.equals('text');
      expect(strInput.value).to.equal('abc');
      expect(numInput.type).to.equals('number');
      expect(numInput.value).to.equal('123');
      expect(boolInput.type).to.equals('checkbox');
      expect(boolInput.checked).to.be.true;
      expect(emptyInput.type).to.equals('text');
      expect(emptyInput.value).to.be.empty;
    });
  });

  describe('onChange', () => {
    it('invokes onChange event on text changed', (done) => {
      render(<PropertiesForm
        types={{ 'myvalue': 'string' }}
        value={{ 'myvalue': 'abc' }}
        onChange={value => {
          expect(value).to.have.property('myvalue', 'abcd');
          done();
        }}
      />, document.body);

      let input = document.querySelector('input[name=myvalue]');
      input.value = 'abcd'
      input.dispatchEvent(new Event('change'))
    });

    it('invokes onChange event on number changeed', (done) => {
      render(<PropertiesForm
        types={{ 'myvalue': 'number' }}
        value={{ '': 123 }}
        onChange={value => {
          expect(value).to.have.property('myvalue', 1234);
          done();
        }}
      />, document.body);

      let input = document.querySelector('input[name=myvalue]');
      input.value = '1234'
      input.dispatchEvent(new Event('change'))
    });

    it('invokes onChange event on checkbox changed', (done) => {
      render(<PropertiesForm
        types={{ 'myvalue': 'boolean' }}
        value={{ 'myvalue': false }}
        onChange={value => {
          expect(value).to.have.property('myvalue', true);
          done();
        }}
      />, document.body);

      let input = document.querySelector('input[name=myvalue]');
      input.click();
    });
  });
});
