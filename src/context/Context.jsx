import { createContext, useState } from "react";
import runChat from "../config/gemini";

import PropTypes from "prop-types";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentprompt, setRecentprompt] = useState("");
  const [prevPrompt, setPrevprompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultdata, setResultData] = useState("");

  const deletePara = (index, nextword) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextword);
    }, 75 * index);
  };

  const neweChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);

    var indata = input;
    setInput("");
    setShowResult(true);
    let res;
    if (prompt != undefined) {
      res = await runChat(prompt);
      setRecentprompt(prompt);
    } else {
      setPrevprompt((prev) => [...prev, indata]);
      setRecentprompt(input);
      res = await runChat(input);
    }

    let resarray = res.split("**");
    let newarray = "";
    for (let i = 0; i < resarray.length; i++) {
      if (i == 0 || i % 2 != 1) {
        newarray += resarray[i];
      } else {
        newarray += "<b>" + resarray[i] + "</b>";
      }
    }
    let newres = newarray.split("*").join("</br>");
    let newresArray = newres.split(" ");
    for (let i = 0; i < newres.length; i++) {
      const nextword = newresArray[i];
      if (nextword != undefined) {
        deletePara(i, nextword + " ");
      }
    }
    setLoading(false);
    // setInput("");
  };

  const contextValue = {
    input,
    setInput,
    recentprompt,
    setRecentprompt,
    prevPrompt,
    setPrevprompt,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultdata,
    setResultData,
    onSent,
    neweChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
