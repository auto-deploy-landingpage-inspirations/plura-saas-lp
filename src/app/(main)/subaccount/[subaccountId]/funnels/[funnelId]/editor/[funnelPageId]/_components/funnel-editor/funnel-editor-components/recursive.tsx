import { EditorElement } from "@/providers/editor/editor-provider";
import React from "react";
import TextComponent from "./text";
import Container from "./container";

type Props = {
  element: EditorElement;
}

const Recursive: React.FC<Props> = ({ element }) => {
  switch (element.type) {
    case "text": 
      return <TextComponent element={element} />;
    case "__body":
    case "container":
      return <Container element={element} />;
    default: 
      return null;
      
  }
}

export default Recursive
