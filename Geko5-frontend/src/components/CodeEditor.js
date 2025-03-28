import AceEditor from "react-ace";
import ace from "ace-builds";

// Importa manualmente i file necessari
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

// Imposta il percorso corretto per il worker
import "ace-builds/src-noconflict/worker-javascript";

ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/");
ace.config.set("modePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/");
ace.config.set("themePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/");
ace.config.set("workerPath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/");

const MyEditor = ({ value, onChange }) => {
  return (
    <AceEditor
      mode="javascript"
      theme="github"
      value={value}
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      setOptions={{
        showLineNumbers: true,
        tabSize: 2,
      }}
      style={{ width: "100%", height: "200px" }}
    />
  );
};

export default MyEditor;
