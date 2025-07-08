import { useCallback } from 'react';
import { javascript } from '@codemirror/lang-javascript';
import { Box } from '@mui/material';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import CodeMirror from '@uiw/react-codemirror';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  onSave: () => void;
}

export default function Editor({ code, setCode, onSave }: EditorProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isSaveShortcut = isMac ? event.metaKey : event.ctrlKey;

      if (isSaveShortcut && event.key.toLowerCase() === 's') {
        event.preventDefault();
        onSave();
      }
    },
    [onSave]
  );

  return (
    <Box onKeyDown={handleKeyDown}>
      <CodeMirror
        value={code}
        height='400px'
        extensions={[javascript()]}
        onChange={(code) => setCode(code)}
        theme={vscodeDark}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
        }}
      />
    </Box>
  );
}
