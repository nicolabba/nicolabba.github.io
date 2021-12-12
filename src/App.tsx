import './components/TypedText/TypedText'
import './App.css';
import TypedText from './components/TypedText/TypedText'
import { Input, Modal, ThemeProvider } from '@react95/core';
import React, { CSSProperties } from 'react';

type TextData = {text: String, onFinishedWriting?: () => void, style?: CSSProperties}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class App extends React.Component<any, {shownTexts: TextData[], nextText: number}> {

  constructor(props: any) {
    super(props)
    this.state = {shownTexts: [], nextText: 0}
    this.loadTypeNextText = this.loadTypeNextText.bind(this);

  }

  textsToType: TextData[] = [
    {text: "Hello, my name is Nicola Abbagnato.", onFinishedWriting: () => {sleep(1000).then(() => {this.loadTypeNextText()})}},
    {text: "How are you?", onFinishedWriting: () => {sleep(3000).then(() => {this.loadTypeNextText()})}},
    {text: "Wait...", style: {display: 'inline-block'}, onFinishedWriting: () => {sleep(1000).then(() => {this.loadTypeNextText()})}},
    {text: "Can't really answer, can you?", style: {marginLeft: '1ch', display: 'inline-block'}}
  ]
  handleCloseModal = (event: React.MouseEvent) => { console.log(event) }
  handleButtonClick = (event: React.MouseEvent) => { console.log(event) }


  loadTypeNextText() {
    this.setState({
      shownTexts: [...this.state.shownTexts, this.textsToType[this.state.nextText]],
      nextText: this.state.nextText + 1
    })
  }

  componentDidMount() {
    this.loadTypeNextText()
  }

  render() {
    const nextText = this.state.nextText
    return (
      <div className="App">
        {this.state.shownTexts.map((element, index) => {
          return <TypedText
            numberKey={index + 1}
            shownCursorKey={nextText}
            text={element.text}
            onFinishedWriting={element.onFinishedWriting}
            style={element.style}
          ></TypedText>
        })}
        {/* <ThemeProvider>
          <Modal
            title="Use this!"
            defaultPosition={{
              x: 200,
              y: 200,
            }}
            closeModal={handleCloseModal}
            buttons={[
              { value: 'Ok', onClick: handleButtonClick },
              { value: 'Cancel', onClick: handleButtonClick },
            ]}
          >
            <Input></Input>
          </Modal>
        </ThemeProvider> */}
      </div>
    );
  }
}

export default App;
