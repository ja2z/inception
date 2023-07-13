import { useMemo } from "react";
import { client, useConfig, useElementData } from "@sigmacomputing/plugin";
const uuid = require('uuid')    
const CryptoJS = require("crypto-js");

client.config.configureEditorPanel([
  { name: "source", type: "element" },
  { name: "dimension", type: "column", source: "source", allowMultiple: false },
  { name: "secret", type: "text", secure: true },
  { name: "client_id", type: "text", secure: false },
  { name: "embed_path", type: "text", secure: false },
  { name: "external_team", type: "text", secure: false },
  { name: "user attributes", type: 'group' },
    { name: "UA_key_1", source: "user attributes", type: "text" },
    { name: "UA_value_1", source: "user attributes", type: "text" },
    { name: "UA_key_2", source: "user attributes", type: "text" },
    { name: "UA_value_2", source: "user attributes", type: "text" },
]);

function App() {
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  const url = useMemo(() => {
    const secret = config.secret;
    const dimensions = config.dimension;
    if (sigmaData?.[dimensions]) {
      const email = sigmaData[dimensions][0];
      let url = config.embed_path;
      url += "?:nonce=" + uuid.v4();
      url += "&:email=" + email;
      url += "&:external_user_team=" + config.external_team;
      url += "&:mode=userbacked";
      url += "&:session_length=3600";
      url += "&:time=" + Math.round(Date.now() / 1000);
      url += "&:external_user_id=" + email;
      url += "&:client_id=" + config.client_id;
      url += "&:ua_" + config.UA_key_1 + "=" + config.UA_value_1;
      if (config.UA_key_2 !== "") {
         url += "&:ua_" + config.UA_key_2 + "=" + config.UA_value_2;
      }; 
      url += "&:signature=" + CryptoJS.HmacSHA256(url, secret);
      return (url)
    }
  }, [config, sigmaData]);

  return (
     <iframe width="100%" height="2000" src={url}/>
  );
}

export default App;
