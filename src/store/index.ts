import editor, { EditorProps } from './editor';
import { TemplateDataProps } from './template';
import { createStore } from "vuex";
import template from './template';
import { UserDataProps } from './user';
import user from './user';

export interface GlobalStoreStateProps {
  // [propName: string]: any
  template: TemplateDataProps,
  user: UserDataProps,
  editor: EditorProps
}

export default createStore<GlobalStoreStateProps>({
  // state: {},
  // mutations: {},
  // actions: {},
  modules: {
    template,
    user,
    editor, 
  },
});