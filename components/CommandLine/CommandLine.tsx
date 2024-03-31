import React, {
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import { v4 as uuid } from "uuid";

import Heading from "components/Heading";
import Pre, { WhiteSpace } from "components/Pre";
import { useAuth, useOnScreen, useToast, useTranslations } from "hooks";

function CommandLine(): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const sampRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { addToast } = useToast();
  const { translations } = useTranslations();
  const isVisible = useOnScreen(sampRef, "-150px");
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<
    { value: string; id: string; type: "input" | "command" }[]
  >([{ value: translations.terminal.welcome, id: uuid(), type: "command" }]);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [caretPosition, setCaretPosition] = useState<number>(command.length);
  const userName = user?.display_name ?? translations.common.guest;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
    setIsTyping(true);
    resetTypingTimer();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    resetTypingTimer();
  };

  const resetTypingTimer = () => {
    setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    if (inputRef.current && isVisible) {
      inputRef.current.focus();
    }
    if (sampRef.current) {
      sampRef.current.scrollTop = sampRef.current.scrollHeight;
    }
  }, [history, isVisible]);

  const handleClick = () => {
    const selection = window.getSelection();
    if (inputRef.current && !selection?.toString()) {
      inputRef.current.focus();
    }
  };

  const handleArrowUp = () => {
    if (history.length > 0) {
      const filteredHistory = history
        .slice(0, historyIndex === -1 ? undefined : historyIndex)
        .reverse()
        .filter((entry) => entry.type === "input");

      if (filteredHistory.length > 0) {
        const newIndex = history.findIndex(
          (entry) => entry.id === filteredHistory[0].id
        );
        setCommand(filteredHistory[0].value);
        setCaretPosition(filteredHistory[0].value.length);
        setHistoryIndex(newIndex);
      }
    }
  };

  const handleArrowDown = () => {
    if (historyIndex >= 0 && historyIndex < history.length - 1) {
      const filteredHistory = history
        .slice(historyIndex + 1)
        .filter((entry) => entry.type === "input");

      if (filteredHistory.length > 0) {
        const newIndex = history.findIndex(
          (entry) => entry.id === filteredHistory[0].id
        );
        setCommand(filteredHistory[0].value);
        setHistoryIndex(newIndex);
      }
    } else {
      setCommand("");
      setHistoryIndex(-1);
    }
    setCaretPosition(command.length + 1);
  };

  const handleCommand = (command: string) => {
    if (command.toLocaleLowerCase() === "clear") {
      setHistory([]);
      return;
    }

    if (command.toLocaleLowerCase() === "help") {
      setHistory((prev) => [
        ...prev,
        {
          value: translations.terminal.commandMessages.help,
          id: uuid(),
          type: "command",
        },
      ]);
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        value: translations.terminal.commandMessages.unrecognizedCommand,
        id: uuid(),
        type: "command",
      },
    ]);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setHistoryIndex(-1);
      setHistory((prev) => {
        return [...prev, { value: command, id: uuid(), type: "input" }];
      });
      handleCommand(command.trim());
      setCommand("");
      setIsTyping(true);
      setCaretPosition(0);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleArrowUp();
    }
    if (e.key === "ArrowDown") {
      handleArrowDown();
    }

    const isCommand = () => {
      return e.ctrlKey || e.altKey || e.metaKey;
    };

    if (e.key === "ArrowLeft" && !isCommand()) {
      setIsTyping(true);
      resetTypingTimer();
      setCaretPosition((prev) => Math.max(0, prev - 1));
      return;
    }
    if (e.key === "ArrowRight" && !isCommand()) {
      setIsTyping(true);
      resetTypingTimer();
      setCaretPosition((prev) => Math.min(command.length, prev + 1));
      return;
    }

    const isUnidentifiedKey = e.key === "Unidentified";

    if ((e.key.length === 1 || isUnidentifiedKey) && !isCommand()) {
      setCaretPosition((prev) => prev + 1);
    }

    if (e.key === "Backspace" && !isCommand()) {
      setCaretPosition((prev) => Math.max(0, prev - 1));
    }

    if (inputRef.current && !isCommand()) {
      inputRef.current.focus();
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCommand(
        command.slice(0, caretPosition) + text + command.slice(caretPosition)
      );
      setCaretPosition(command.length + text.length);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      addToast({
        variant: "error",
        message: translations.toastMessages.failToPasteFromClipboard,
      });
    }
  };

  return (
    <div
      role="combobox"
      tabIndex={0}
      aria-controls="command-history"
      aria-expanded={true}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onContextMenu={handlePasteFromClipboard}
    >
      <header>
        <Heading number={5} as="h2">
          {translations.terminal.title}
        </Heading>
      </header>
      <samp ref={sampRef}>
        <Pre whiteSpace={WhiteSpace.PreWrap}>
          {history.map(({ value, id, type }) => (
            <code key={id}>
              {type === "input" ? `${userName}@Rindu:~$ ` : ""}
              {value}
              {"\n"}
            </code>
          ))}
          <span>{userName}@Rindu:~$ </span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            defaultValue={command}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            onPaste={handlePasteFromClipboard}
          />
          <span>
            {command.slice(0, caretPosition)}
            <span
              className={isFocused && !isTyping ? "cursor blink" : "cursor"}
            >
              {command.slice(caretPosition, caretPosition + 1) || (
                <span
                  className={isFocused && !isTyping ? "block blink" : "block"}
                >
                  {String.fromCharCode(160)}
                </span>
              )}
            </span>
            {command.slice(caretPosition + 1)}
          </span>
        </Pre>
      </samp>
      <style jsx>
        {`
          header {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            background-color: #35393c;
            border-radius: 12px 12px 0 0;
            padding: 0 12px;
          }
          div {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            height: 100%;
            max-height: 420px;
            height: 420px;
            cursor: text;
          }
          samp {
            overflow-y: auto;
            height: 100%;
            background-color: #1d1f21;
            opacity: 0.8;
          }
          div :global(pre) {
            background-color: transparent;
          }
          .blink {
            animation: command-line-blink 1.2s step-end infinite;
          }
          .cursor {
            color: white;
            outline: 1px solid #fff;
          }
          .block {
            background: #fff;
          }
          input {
            caret-color: transparent;
            width: 100%;
            outline: none;
            color: inherit;
            border: none;
            position: absolute;
            top: -10000px;
            left: -10000px;
          }

          @keyframes command-line-blink {
            50% {
              background-color: transparent;
              outline: none;
            }
          }
        `}
      </style>
    </div>
  );
}

export default CommandLine;
