import React from "react";
import Completion from "../../../../src/console/components/console/Completion";
import ReactTestRenderer from "react-test-renderer";
import CompletionTitle from "../../../../src/console/components/console/CompletionTitle";
import CompletionItem from "../../../../src/console/components/console/CompletionItem";

describe("console/components/console/completion/Completion", () => {
  const completions = [
    {
      name: "Fruit",
      items: [
        { primary: "apple", value: "apple" },
        { primary: "banana", value: "banana" },
        { primary: "cherry", value: "cherry" },
      ],
    },
    {
      name: "Element",
      items: [
        { primary: "argon", value: "argon" },
        { primary: "boron", value: "boron" },
        { primary: "carbon", value: "carbon" },
      ],
    },
  ];

  it("renders Completion component", () => {
    const root = ReactTestRenderer.create(
      <Completion completions={completions} size={30} select={-1} />
    ).root;

    const groups = root.findAllByProps({ role: "group" });
    expect(groups).toHaveLength(2);

    groups.forEach((group, i) => {
      const title = group.findByType(CompletionTitle);
      expect(title.props.title).toEqual(completions[i].name);

      const items = group.findAllByType(CompletionItem);
      expect(items).toHaveLength(completions[i].items.length);
      items.forEach((item, j) => {
        expect(item.props.primary).toEqual(completions[i].items[j].primary);
      });
    });
  });

  it("highlight current item", () => {
    const root = ReactTestRenderer.create(
      <Completion completions={completions} size={30} select={3} />
    ).root;

    const items = root.findAllByType(CompletionItem);
    expect(items[3].props.highlight).toBeTruthy;
  });

  it("does not highlight any items", () => {
    const root = ReactTestRenderer.create(
      <Completion completions={completions} size={30} select={-1} />
    ).root;

    const items = root.findAllByType(CompletionItem);
    expect(items.every((item) => item.props.highlight === false)).toBeTruthy;
  });

  it("limits completion items", () => {
    let root = ReactTestRenderer.create(
      <Completion completions={completions} size={3} select={-1} />
    ).root;

    const showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();

    expect(showns).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);

    root = ReactTestRenderer.create(
      <Completion completions={completions} size={3} select={0} />
    ).root;

    const items = root
      .findAllByType(CompletionItem)
      .map((item) => item.props.shown);
    expect(items[1]).toBeTruthy;
  });

  it("scrolls up to down with select", () => {
    let component: ReactTestRenderer.ReactTestRenderer | null = null;

    ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Completion completions={completions} size={3} select={1} />
      );
    });

    const root = component!.root;

    let items = root.findAllByType(CompletionItem);
    let showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();
    expect(showns).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);

    ReactTestRenderer.act(() => {
      component!.update(
        <Completion completions={completions} size={3} select={2} />
      );
    });
    items = root.findAllByType(CompletionItem);
    showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();
    expect(showns).toEqual([
      false,
      true,
      true,
      true,
      false,
      false,
      false,
      false,
    ]);
    expect(items[2].props.highlight).toBeTruthy;

    ReactTestRenderer.act(() => {
      component!.update(
        <Completion completions={completions} size={3} select={3} />
      );
    });
    items = root.findAllByType(CompletionItem);
    showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();
    expect(showns).toEqual([
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
    ]);
    expect(items[3].props.highlight).toBeTruthy;
  });

  it("scrolls down to up with select", () => {
    let component: ReactTestRenderer.ReactTestRenderer | null = null;

    ReactTestRenderer.act(() => {
      component = ReactTestRenderer.create(
        <Completion completions={completions} size={3} select={5} />
      );
    });
    const root = component!.root;

    let items = root.findAllByType(CompletionItem);
    let showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();

    expect(showns).toEqual([
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
    ]);
    expect(items[5].props.highlight).toBeTruthy;

    ReactTestRenderer.act(() => {
      component!.update(
        <Completion completions={completions} size={3} select={4} />
      );
    });
    items = root.findAllByType(CompletionItem);
    showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();
    expect(showns).toEqual([
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
    ]);
    expect(items[4].props.highlight).toBeTruthy;

    ReactTestRenderer.act(() => {
      component!.update(
        <Completion completions={completions} size={3} select={3} />
      );
    });
    items = root.findAllByType(CompletionItem);
    showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();
    expect(showns).toEqual([
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      true,
    ]);
    expect(items[3].props.highlight).toBeTruthy;

    ReactTestRenderer.act(() => {
      component!.update(
        <Completion completions={completions} size={3} select={2} />
      );
    });
    items = root.findAllByType(CompletionItem);
    showns = root
      .findAllByProps({ role: "group" })
      .map((group) =>
        [
          group.findByType(CompletionTitle).props.shown,
          group.findAllByType(CompletionItem).map((item) => item.props.shown),
        ].flat()
      )
      .flat();
    expect(showns).toEqual([
      false,
      false,
      false,
      true,
      true,
      true,
      false,
      false,
    ]);
    expect(items[2].props.highlight).toBeTruthy;
  });
});
