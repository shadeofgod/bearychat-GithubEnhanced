const FORM_TYPES = {
  section: 'section',
  context: 'context',
  image: 'image',
  divider: 'divider',
  input: 'input',
  select: 'select',
  memberSelect: 'member-select',
  channelSelect: 'channel-select',
  dateSelect: 'date-select',
  submit: 'submit',
}

const createSection = (text) => ({
  type: FORM_TYPES.section,
  text: {
    value: text,
    markdown: true,
  }
})

const createContext = (...texts) => ({
  type: FORM_TYPES.context,
  elements: texts.map(t => ({ type: 'text', text: t })),
});

const createInput = (name, props = {}) => ({
  type: FORM_TYPES.input,
  name,
  ...props,
});

const createChannelSelect = (name, props = {}) => ({
  type: FORM_TYPES.channelSelect,
  name,
  ...props,
});

const createSubmit = (name, text, kind = 'normal') => ({
  type: FORM_TYPES.submit,
  name,
  text,
  kind,
});

const createMemberSelect = (name, props = {}) => ({
  type: FORM_TYPES.memberSelect,
  name,
  ...props,
});

module.exports = {
  FORM_TYPES,
  createSection,
  createContext,
  createInput,
  createChannelSelect,
  createSubmit,
  createMemberSelect,
};
