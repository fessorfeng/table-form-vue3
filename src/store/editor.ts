import { ImageComponentProps } from './../defaultProps';
import { Module, MutationTree, ActionTree, GetterTree } from 'vuex';
import { GlobalStoreStateProps } from './index';
import { v4 as uuid } from 'uuid';
import { TextComponentProps } from '../defaultProps';
import { clone } from 'lodash-es';

export interface EditorProps {
  components: ComponentsData[];
  currentElement: string;
}

export interface ComponentsData {
  props: { [propName: string]: any };
  id: string; // uuid 直接生成
  // 业务组件名称 l-text, l-image
  name: string;
}

const componentsData: ComponentsData[] = [
  {
    id: uuid(),
    name: 'l-text',
    props: { text: 'hell1', fontSize: '15px', color: 'red' },
  },
  {
    id: uuid(),
    name: 'l-text',
    props: {
      text: 'hell2',
      fontSize: '19px',
      url: 'http://www.baidu.com',
      actionType: 'url',
    },
  },
  {
    id: uuid(),
    name: 'l-text',
    props: {
      text: 'hell3',
      fontSize: '25px',
      fontWeight: 'bold',
      color: '#000000',
      backgroundColor: '#409EFF',
      opacity: '1',
      textAlign: 'center',
      fontFamily: 'Arial',
      lineHeight: '1.3',
      
    },
  },
];
const state: EditorProps = {
  components: componentsData,
  currentElement: '',
};

const getters: GetterTree<EditorProps, GlobalStoreStateProps> = {
  getCurrentElement(state) {
    const res = state.components.filter(
      (com) => com.id === state.currentElement
    );
    return res ? res[0] : null;
  },
};

const actions: ActionTree<EditorProps, GlobalStoreStateProps> = {};

const mutations: MutationTree<EditorProps> = {
  addComponent(state, item: Partial<TextComponentProps | ImageComponentProps>) {
    const com: ComponentsData = {
      id: uuid(),
      name: Object.keys(item).includes('src') ? 'l-image' : 'l-text',
      props: clone(item),
    };
    state.components.push(com);
  },
  setActive(state, componentId: string) {
    state.currentElement = componentId;
  },
  updateComponentProps(state, { key, value }) {
    const k = key as keyof TextComponentProps;
    const currentElement = state.components.find(
      (com) => com.id === state.currentElement
    );

    if (currentElement) {
      currentElement.props[k] = value;
    }
  },
};

const editor: Module<EditorProps, GlobalStoreStateProps> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
export default editor;
