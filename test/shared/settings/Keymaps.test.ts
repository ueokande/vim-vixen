import Keymaps from '../../../src/shared/settings/Keymaps';
import { expect } from 'chai';

describe('Keymaps', () => {
  describe('#valueOf', () => {
    it('returns empty object by empty settings', () => {
      const keymaps = Keymaps.fromJSON({}).toJSON();
      expect(keymaps).to.be.empty;
    });

    it('returns keymaps by valid settings', () => {
      const keymaps = Keymaps.fromJSON({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      }).toJSON();

      expect(keymaps['k']).to.deep.equal({ type: "scroll.vertically", count: -1 });
      expect(keymaps['j']).to.deep.equal({ type: "scroll.vertically", count: 1 });
    });

    it('throws a TypeError by invalid settings', () => {
      expect(() => Keymaps.fromJSON({
        k: { type: "invalid.operation" },
      })).to.throw(TypeError);
    });
  });

  describe('#combine', () => {
    it('returns combined keymaps', () => {
      const keymaps = Keymaps.fromJSON({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      }).combine(Keymaps.fromJSON({
        n: { type: "find.next" },
        N: { type: "find.prev" },
      }));

      const entries = keymaps.entries().sort(([name1], [name2]) => name1.localeCompare(name2));
      expect(entries).deep.equals([
        ['j', { type: "scroll.vertically", count: 1 }],
        ['k', { type: "scroll.vertically", count: -1 }],
        ['n', { type: "find.next" }],
        ['N', { type: "find.prev" }],
      ]);
    });

    it('overrides current keymaps', () => {
      const keymaps = Keymaps.fromJSON({
        k: { type: "scroll.vertically", count: -1 },
        j: { type: "scroll.vertically", count: 1 },
      }).combine(Keymaps.fromJSON({
        n: { type: "find.next" },
        j: { type: "find.prev" },
      }));

      const entries = keymaps.entries().sort(([name1], [name2]) => name1.localeCompare(name2));
      expect(entries).deep.equals([
        ['j', { type: "find.prev" }],
        ['k', { type: "scroll.vertically", count: -1 }],
        ['n', { type: "find.next" }],
      ]);
    });
  });
});

