import React from 'react';
import Completion from 'console/components/console/Completion'
import ReactTestRenderer from 'react-test-renderer';

describe("console/components/console/completion", () => {
  let completions = [{
    name: "Fruit",
    items: [{ caption: "apple" }, { caption: "banana" }, { caption: "cherry" }],
  }, {
    name: "Element",
    items: [{ caption: "argon" }, { caption: "boron" }, { caption: "carbon" }],
  }];

  it('renders Completion component', () => {
    let root = ReactTestRenderer.create(<Completion
      completions={completions}
      size={30}
      />).root;

    expect(root.children).to.have.lengthOf(1);

    let children = root.children[0].children;
    expect(children).to.have.lengthOf(8);
    expect(children[0].props.title).to.equal('Fruit');
    expect(children[1].props.caption).to.equal('apple');
    expect(children[2].props.caption).to.equal('banana');
    expect(children[3].props.caption).to.equal('cherry');
    expect(children[4].props.title).to.equal('Element');
    expect(children[5].props.caption).to.equal('argon');
    expect(children[6].props.caption).to.equal('boron');
    expect(children[7].props.caption).to.equal('carbon');
  });

  it('highlight current item', () => {
    let root = ReactTestRenderer.create(<Completion
      completions={completions}
      size={30}
      select={3}
      />).root;

    let children = root.children[0].children;
    expect(children[5].props.highlight).to.be.true;
  });

  it('does not highlight any items', () => {
    let root = ReactTestRenderer.create(<Completion
      completions={completions}
      size={30}
      select={-1}
      />).root;

    let children = root.children[0].children;
    for (let li of children[0].children) {
      expect(li.props.highlight).not.to.be.ok;
    }
  });

  it('limits completion items', () => {
    let root = ReactTestRenderer.create(<Completion
      completions={completions}
      size={3}
      select={-1}
      />).root;

    let children = root.children[0].children;
    expect(children).to.have.lengthOf(3);

    expect(children[0].props.title).to.equal('Fruit');
    expect(children[1].props.caption).to.equal('apple');
    expect(children[2].props.caption).to.equal('banana');

    root = ReactTestRenderer.create(<Completion
      completions={completions}
      size={3} select={0}
      />).root;

    children = root.children[0].children;
    expect(children[1].props.highlight).to.be.true;
  })

  it('scrolls up to down with select', () => {
    let component = ReactTestRenderer.create(<Completion
      completions={completions}
      size={3}
      select={1}
      />);
    let instance = component.getInstance();
    let root = component.root;

    let children = root.children[0].children;
    expect(children).to.have.lengthOf(3);
    expect(children[0].props.title).to.equal('Fruit');
    expect(children[1].props.caption).to.equal('apple');
    expect(children[2].props.caption).to.equal('banana');

    component.update(<Completion
      completions={completions}
      size={3}
      select={2}
    />);

    children = root.children[0].children;
    expect(children).to.have.lengthOf(3);
    expect(children[0].props.caption).to.equal('apple');
    expect(children[1].props.caption).to.equal('banana');
    expect(children[2].props.caption).to.equal('cherry');
    expect(children[2].props.highlight).to.be.true;

    component.update(<Completion
      completions={completions}
      size={3}
      select={3}
    />);

    children = root.children[0].children;
    expect(children).to.have.lengthOf(3);
    expect(children[0].props.caption).to.equal('cherry');
    expect(children[1].props.title).to.equal('Element');
    expect(children[2].props.caption).to.equal('argon');
    expect(children[2].props.highlight).to.be.true;
  });

  it('scrolls down to up with select', () => {
    let component = ReactTestRenderer.create(<Completion
      completions={completions}
      size={3}
      select={5}
      />);
    let root = component.root;
    let instance = component.getInstance();

    let children = root.children[0].children;
    expect(children).to.have.lengthOf(3);
    expect(children[0].props.caption).to.equal('argon');
    expect(children[1].props.caption).to.equal('boron');
    expect(children[2].props.caption).to.equal('carbon');

    component.update(<Completion
      completions={completions}
      size={3}
      select={4}
    />);

    children = root.children[0].children;
    expect(children[1].props.highlight).to.be.true;

    component.update(<Completion
      completions={completions}
      size={3}
      select={3}
    />);

    children = root.children[0].children;
    expect(children[0].props.highlight).to.be.true;

    component.update(<Completion
      completions={completions}
      size={3}
      select={2}
    />);

    children = root.children[0].children;
    expect(children[0].props.caption).to.equal('cherry');
    expect(children[1].props.title).to.equal('Element');
    expect(children[2].props.caption).to.equal('argon');
    expect(children[0].props.highlight).to.be.true;
  });
});
