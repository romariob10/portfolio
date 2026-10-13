// Desktop rotation follows Roman's video; mobile CSS replaces it with a slide.
const animation = (name) => ({
  name,
  duration: '300ms',
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

// One 300 ms desktop sequence: the old rail leaves, then the new rail enters.
const railPair = {
  old: { ...animation('rail-out'), duration: '150ms' },
  new: { ...animation('rail-in'), duration: '150ms', delay: '150ms' },
};

export const railMotion = { forwards: railPair, backwards: railPair };

const fadePair = {
  old: animation('article-fade-out'),
  new: animation('article-fade-in'),
};

export const fadeMotion = { forwards: fadePair, backwards: fadePair };
