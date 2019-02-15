import { h, render } from 'preact';
import Completion from 'console/components/console/completion'

describe("console/components/console/completion", () => {
  let completions = [{
    name: "Fruit",
    items: [{ caption: "apple" }, { caption: "banana" }, { caption: "cherry" }],
  }, {
    name: "Element",
    items: [{ caption: "argon" }, { caption: "boron" }, { caption: "carbon" }],
  }];

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders Completion component', () => {
    let ul = render(<Completion
      completions={completions}
      size={30}
      />, document.body);

    expect(ul.children).to.have.lengthOf(8);
    expect(ul.children[0].textContent).to.equal('Fruit');
    expect(ul.children[1].textContent).to.equal('apple');
    expect(ul.children[2].textContent).to.equal('banana');
    expect(ul.children[3].textContent).to.equal('cherry');
    expect(ul.children[4].textContent).to.equal('Element');
    expect(ul.children[5].textContent).to.equal('argon');
    expect(ul.children[6].textContent).to.equal('boron');
    expect(ul.children[7].textContent).to.equal('carbon');
  });

  it('highlight current item', () => {
    let ul = render(<Completion
      completions={completions}
      size={30}
      select={3}
      />, document.body);
    expect(ul.children[5].className.split(' ')).to.include('vimvixen-completion-selected');
  });

  it('does not highlight any items', () => {
    let ul = render(<Completion
      completions={completions}
      size={30}
      select={-1}
      />, document.body);
    for (let li of ul.children) {
      expect(li.className.split(' ')).not.to.include('vimvixen-completion-selected');
    }
  });


  it('limits completion items', () => {
    let ul = render(<Completion
      completions={completions}
      size={3}
      select={-1}
      />, document.body);
    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['Fruit', 'apple', 'banana']);

    ul = render(<Completion
      completions={completions}
      size={3} select={0}
      />, document.body, ul);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['Fruit', 'apple', 'banana']);
    expect(ul.children[1].className.split(' ')).to.include('vimvixen-completion-selected');
  })

  it('scrolls up to down with select', () => {
    let ul = render(<Completion
      completions={completions}
      size={3}
      select={1}
      />, document.body);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['Fruit', 'apple', 'banana']);
    expect(ul.children[2].className.split(' ')).to.include('vimvixen-completion-selected');

    ul = render(<Completion
      completions={completions}
      size={3}
      select={2}
      />, document.body, ul);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['apple', 'banana', 'cherry']);
    expect(ul.children[2].className.split(' ')).to.include('vimvixen-completion-selected');

    ul = render(<Completion
      completions={completions}
      size={3}
      select={3}
      />, document.body, ul);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['cherry', 'Element', 'argon']);
    expect(ul.children[2].className.split(' ')).to.include('vimvixen-completion-selected');
  });

  it('scrolls up to down with select', () => {
    let ul = render(<Completion
      completions={completions}
      size={3}
      select={5}
      />, document.body);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['argon', 'boron', 'carbon']);
    expect(ul.children[2].className.split(' ')).to.include('vimvixen-completion-selected');

    ul = render(<Completion
      completions={completions}
      size={3}
      select={4}
      />, document.body, ul);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['argon', 'boron', 'carbon']);
    expect(ul.children[1].className.split(' ')).to.include('vimvixen-completion-selected');

    ul = render(<Completion
      completions={completions}
      size={3}
      select={3}
      />, document.body, ul);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['argon', 'boron', 'carbon']);
    expect(ul.children[0].className.split(' ')).to.include('vimvixen-completion-selected');

    ul = render(<Completion
      completions={completions}
      size={3}
      select={2}
      />, document.body, ul);

    expect(Array.from(ul.children).map(e => e.textContent)).to.deep.equal(['cherry', 'Element', 'argon']);
    expect(ul.children[0].className.split(' ')).to.include('vimvixen-completion-selected');
  });
});
