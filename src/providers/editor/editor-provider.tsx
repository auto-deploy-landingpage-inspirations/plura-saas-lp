'use client';
import { EditorBtns } from "@/lib/constants";
import { EditorAction } from "./editor-actions";
import { Dispatch, createContext, useContext, useReducer } from "react";
import { FunnelPage } from "@prisma/client";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type EditorElement = {
  id: string;
  styles: React.CSSProperties;
  name: string;
  type: EditorBtns;
  content: | EditorElement[] | { href?: string; };
}

export type Editor = {
  elements: EditorElement[];
  selectedElement: EditorElement;
  device: DeviceTypes;
  liveMode: boolean;
  previewMode: boolean;
  funnelPageId: string;
}

export type HistoryState = {
  history: Editor[];
  currentIndex: number;
}

export type EditorState = {
  editor: Editor;
  history: HistoryState;
}

const initialEditorState: EditorState['editor'] = {
  elements: [
    {
      content: [],
      id: '__body',
      name: 'Body',
      styles: {},
      type: '__body'
    },
  ],
  selectedElement: {
    id: '',
    content: [],
    name: '',
    styles: {},
    type: null,
  },
  device: 'Desktop',
  previewMode: false,
  liveMode: false,
  funnelPageId: '',
}

const initialHistoryState: HistoryState = {
  history: [initialEditorState],
  currentIndex: 0,
}

const initialState: EditorState = {
  editor: initialEditorState,
  history: initialHistoryState,
}

const addAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== 'ADD_ELEMENT')
    throw Error('You sent the wrong action type to the Add Element editor state');
  return editorArray.map((item) => {
    if (item.id === action.payload.containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, action.payload.elementDetails],
      }
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addAnElement(item.content, action),
      }
    }
    return item;
  })
}

const updateAnElement = (
  editorArray: EditorElement[],
  action: EditorAction
): EditorElement[] => {
  if (action.type !== "UPDATE_ELEMENT")
    throw Error('You sent the wrong action type to the Update Element editor state');
  return editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return { ...item, ...action.payload.elementDetails };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: updateAnElement(item.content, action),
      }
    }
    return item;
  })
}

const deleteAnElement = (
  editorArray: EditorElement[],
  action: EditorAction,
): EditorElement[] => {
  if (action.type !== "DELETE_ELEMENT")
    throw Error('You sent the wrong action type to the Update Element editor state');

  const newArray = editorArray.map((item) => {
    if (item.id === action.payload.elementDetails.id) {
      return undefined;
    }
    else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: deleteAnElement(item.content, action),
      }
    }
    return item;
  });
  return newArray.filter(item => !!item) as EditorElement[];
}

const editorReducer = (
  state: EditorState = initialState,
  action: EditorAction,
): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updatedEditorState = {
        ...state.editor,
        element: addAnElement(state.editor.elements, action),
      };
      const updatedHistory = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorState },
      ];
      const newEditorState = {
        ...state,
        editor: updatedEditorState,
        history: {
          ...state.history,
          history: updatedHistory,
          currentIndex: updatedHistory.length - 1,
        }
      }
      return newEditorState;

    case "UPDATE_ELEMENT":
      const updatedElements = updateAnElement(state.editor.elements, action);
      const updatedElementIsSelected =
        state.editor.selectedElement.id === action.payload.elementDetails.id;
      const updatedEditorStateWithUpdate = {
        ...state.editor,
        elements: updatedElements,
        selectedElement: updatedElementIsSelected
          ? action.payload.elementDetails
          : {
            id: "",
            content: [],
            name: '',
            styles: {},
            type: null,
          },
      }
      const updatedHistoryWithUpdate = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithUpdate },
      ]
      const updatedEditor = {
        ...state,
        editor: updatedEditorStateWithUpdate,
        history: {
          ...state.history,
          history: updatedHistoryWithUpdate,
          currentIndex: updatedHistoryWithUpdate.length - 1,
        }
      }
      return updatedEditor;

    case "DELETE_ELEMENT":
      const filteredElements = deleteAnElement(state.editor.elements, action);
      const updatedEditorWithFilter = {
        ...state.editor,
        elements: filteredElements,
        selectedElement: {
          id: '',
          content: [],
          name: '',
          styles: {},
          type: null,
        },
      }
      const updatedHistoryWithFilter = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorWithFilter },
      ];

      const filteredEditorState = {
        ...state,
        editor: updatedEditorWithFilter,
        history: {
          ...state.history,
          history: updatedHistoryWithFilter,
          currentIndex: updatedHistoryWithFilter.length - 1,
        }
      }

      return filteredEditorState

    case "CHANGE_CLICKED_ELEMENT":
      const clickedState = {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: '',
            content: [],
            name: '',
            styles: {},
            type: null,
          },
        },
        history: {
          ...state.history,
          history: [
            ...state.history.history.slice(0, state.history.currentIndex + 1),
            { ...state.editor },
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };
      return clickedState;

    case "CHANGE_DEVICE":
      const changedDeviceState = {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };
      return changedDeviceState;

    case "TOGGLE_PREVIEW_MODE":
      const toggledState = {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        }
      }
      return toggledState;

    case "TOGGLE_LIVE_MODE":
      const toggledLiveMode = {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action.payload
            ? action.payload.value
            : !state.editor.liveMode,
        },
      };
      return toggledLiveMode;

    case "REDO":
      if (state.history.currentIndex < state.history.history.length - 1) {
        const nextIndex = state.history.currentIndex + 1;
        const nextEditorState = { ...state.history.history[nextIndex] };
        const redoState = {
          ...state,
          editor: nextEditorState,
          history: {
            ...state.history,
            currentIndex: nextIndex,
          },
        };
        return redoState;
      }
      return state;

    case "UNDO":
      if (state.history.currentIndex > 0) {
        const prevIndex = state.history.currentIndex - 1;
        const prevEditorState = { ...state.history.history[prevIndex] };
        const undoState = {
          ...state,
          editor: prevEditorState,
          history: {
            ...state.history,
            currentIndex: prevIndex,
          },
        };
        return undoState;
      }
      return state;

    case "LOAD_DATA":
      return {
        ...initialState,
        editor: {
          ...initialState.editor,
          elements: action.payload.elements || initialEditorState.elements,
          liveMode: !!action.payload.withLive,
        }
      }

    case "SET_FUNNELPAGE_ID":
      const { funnelPageId } = action.payload;
      const updatedEditorStateWithFunnelPageId = {
        ...state.editor,
        funnelPageId,
      };

      const updatedHistoryWithFunnelPageId = [
        ...state.history.history.slice(0, state.history.currentIndex + 1),
        { ...updatedEditorStateWithFunnelPageId },
      ]

      const funnelPageIdState = {
        ...state,
        editor: updatedEditorStateWithFunnelPageId,
        history: {
          ...state.history,
          history: updatedHistoryWithFunnelPageId,
          currentIndex: updatedHistoryWithFunnelPageId.length - 1,
        }
      }
      return funnelPageIdState;

    default:
      return state;
  }
}

export type EditorContextData = {
  device: DeviceTypes;
  previewMode: boolean;
  setPreviewMode: (previewMode: boolean) => void;
  setDevice: (device: DeviceTypes) => void;
}

export const EditorContext = createContext<{
  state: EditorState;
  dispatch: Dispatch<EditorAction>
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
}>({
  state: initialState,
  dispatch: () => undefined,
  subaccountId: '',
  funnelId: '',
  pageDetails: null,
})


type EditorProps = {
  children: React.ReactNode;
  subaccountId: string;
  funnelId: string;
  pageDetails: FunnelPage | null;
};

const EditorProvider = (props: EditorProps) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        subaccountId: props.subaccountId,
        funnelId: props.funnelId,
        pageDetails: props.pageDetails,
      }}
    >
      {props.children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor hook must be used within the editor provider");
  }
  return context;
}

export default EditorProvider;
