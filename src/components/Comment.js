// ReactとReactBootstrapのコンポーネントをインポート
// ReactMarkdownとaxiosライブラリはコメントアウトされている
import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
// import ReactMarkdown from "react-markdown";
import axios from "axios";

const Comment = () => {
  // ユーザーが入力したコードと生成されたコメントを管理するstate
  const [inputCode, setInputElement] = useState("");
  const [newCode, setNewCode] = useState("ここに表示されます。");
  // 「コメントを付ける」ボタン用のstate（APIが処理中の場合にボタンを無効化するため）
  const [disable, setDisable] = useState(false);
  // コメントの言語を指定するためのstate
  const [lang, setLang] = useState("");

  // OpenAIのAPIで使う情報
  const API_URL = "https://api.openai.com/v1/";
  const MODEL = "gpt-3.5-turbo";
  const API_KEY = process.env.REACT_APP_API_KEY;

  // 入力されたコードにコメントを付けるための関数
  const throwChatGPT = async () => {
    if (inputCode !== "") {
      // クリックがされた時に「コメントを付ける」ボタンを押せないようにする
      setDisable(true);
      setNewCode("生成中...");
      try {
        console.log("now throwing..."); // APIを呼び出す時のログを出力
        let message = `
# 指示
以下にある「コード」にあるのは、${lang}で書かれたコードです。あなたは「## 制約」に書いてある制約に従い、このコードに対してコメントを付けて出力してください。修正した方がよい箇所や冗長な箇所があった場合、「TODO」を付けた上でコメントを付けてください。

## 制約
・コメントは1行のコードにつき2文程度記述してください。
・コメントはコードの1つ前の行にコメントを書いてください。後ろの行に書いたり、コードの行に一緒に書いてはいけません。
・コードの形(インデントなど)はもとの形のまま維持してください。
・コードとコメント以外は、決して文章などを出力しないでください。

## コード
${inputCode}
`;
        // OpenAIのAPIを呼び出して、生成されたコメントを取得する
        const response = await axios.post(
          `${API_URL}chat/completions`,
          {
            // モデル ID の指定
            model: MODEL,
            // 質問内容
            messages: [
              {
                role: "system",
                content:
                  "あなたはプロのプログラマーです。私はプログラミング初心者で、コードの意味を深く学習したいと考えています。あなたは私のメンターとして、プログラミングの学習をサポートする立場にあります。",
              },
              {
                role: "user",
                content: message
              },
            ],
          },
          {
            // 送信する HTTP ヘッダー(認証情報)
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${API_KEY}`,
            },
          }
        );
        // 生成されたコメントを取得する
        setNewCode(response.data.choices[0].message.content);
      } catch (error) {
        console.error(error); // エラーログを出力
        setNewCode("エラーが発生しました。");
      }
      // コメントが生成されたので、「コメントを付ける」ボタンを押せるようにする
      setDisable(false);
    }
  };

  const copyTextToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    .then(function() {
      console.log('Async: Copying to clipboard was successful!'); // コピーに成功した場合のログを出力
    }, function(err) {
      console.error('Async: Could not copy text: ', err); // コピーに失敗した場合のエラーログを出力
    });
  }

  return (
    <Container className="mt-5 mb-5">
      <h1>コード自動コメントアプリ</h1>
      <p>chatGPTを利用して、あなたのコードにコメントを付けます。</p>
      <Row className="mt-5">
        <Col md="4">
          <h2>入力</h2>
          <input
            placeholder="言語を入力..."
            type="text"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="mt-3 mb-3"
          ></input>
          <textarea
            placeholder="コードを貼り付け"
            value={inputCode}
            onChange={(e) => setInputElement(e.target.value)}
            className="textarea mb-3"
          ></textarea>
          <Button disabled={disable} onClick={throwChatGPT}>
            コメントを付ける
          </Button>
        </Col>
        <Col md="8">
          <h2>出力</h2>
          {/* 生成されたコメントをpreタグで表示 */}
          <pre><code>{newCode}</code></pre>
          {/* 生成されたコメントをクリップボードにコピーするボタン */}
          <Button onClick={copyTextToClipboard(newCode)}>完成したコードをコピー</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Comment;