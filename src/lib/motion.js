// The menu's wheel-like movement comes from Roman's video reference.
const animation = (name) => ({
  name,
  duration: '500ms',
  easing: 'ease-in-out',
  fillMode: 'both',
});

export const menuMotion = {
  forwards: {
    old: animation('menu-out-up'),
    new: animation('menu-in-up'),
  },
  backwards: {
    old: animation('menu-out-down'),
    new: animation('menu-in-down'),
  },
};

// One 500 ms sequence: the old rail leaves, then the new rail enters.
const railPair = {
  old: { ...animation('rail-out'), duration: '250ms' },
  new: { ...animation('rail-in'), duration: '250ms', delay: '250ms' },
};

export const railMotion = { forwards: railPair, backwards: railPair };

const fadePair = {
  old: animation('article-fade-out'),
  new: animation('article-fade-in'),
};

export const fadeMotion = { forwards: fadePair, backwards: fadePair };
