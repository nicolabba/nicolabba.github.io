import './main.css';
import TypedText from '../../components/TypedText/TypedText'
import { Input, ThemeProvider } from '@react95/core';
import Modal from '../../components/Modal'
import React, { CSSProperties } from 'react';
import { ModalProps } from '@react95/core/@types/Modal/Modal';

type TextData = {text: String, onFinishedWriting?: () => void, style?: CSSProperties}
type ModalData = {shown: boolean, content: JSX.Element} & ModalProps

class Main extends React.Component<any, {shownTexts: TextData[], modalData: ModalData, nextText: number, nextModal: number}> {

  constructor(props: any) {
    super(props)
    this.state = {shownTexts: [], nextText: 0, modalData: {shown: false, ...this.modalsToShow[0]}, nextModal: 0}
    this.typeNextText = this.typeNextText.bind(this);
    this.loadNextModal = this.loadNextModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }
  handleCloseModal = (event: React.MouseEvent) => { console.log(event) }
  handleButtonClick = (event: React.MouseEvent) => { console.log(event) }

  textsToType: TextData[] = [
    {text: "Hello, my name is Nicola Abbagnato.", onFinishedWriting: () => {this.typeNextText(1000)}},
    {text: "How are you?", onFinishedWriting: () => {this.typeNextText(3000)}},
    {text: "Wait...", style: {display: 'inline-block'}, onFinishedWriting: () => {this.typeNextText(1000)}},
    {text: "Can't really answer, can you?", style: {marginLeft: '1ch', display: 'inline-block'}, onFinishedWriting: () => {
      setTimeout(() => {
        this.loadNextModal()
      }, 1000)
    }}
  ]
    modalsToShow: (ModalProps & {content: JSX.Element})[] = [
    {
      title: 'Here, use this!', 
      closeModal: (event) => {this.hideModal()}, 
      buttons: [{value: 'Ok', onClick: (event) => {this.hideModal()}}],
      content: <Input></Input>}
  ]

  loadNextModal()  {
    this.setState({
      modalData: {...this.modalsToShow[this.state.nextModal], shown: true},
      nextModal: this.state.nextModal + 1
    })
  }

  hideModal() {
    this.setState({
      modalData: {...this.state.modalData, shown: false}
    })
  }

  typeNextText(delay: number = 0) {
    setTimeout(() => {
      this.setState({
        shownTexts: [...this.state.shownTexts, this.textsToType[this.state.nextText]],
        nextText: this.state.nextText + 1
      })
    }, delay)
  }

  componentDidMount() {
    this.typeNextText()
  }

  render() {
    const nextText = this.state.nextText
    return (
      <div className="main">
        {this.state.shownTexts.map((element, index) => {
          return <TypedText
            numberKey={index + 1}
            shownCursorKey={nextText}
            text={element.text}
            onFinishedWriting={element.onFinishedWriting}
            style={element.style}
          ></TypedText>
        })}
        {
          this.state.modalData.shown ? <ThemeProvider><Modal
            title={this.state.modalData.title}
            closeModal={this.state.modalData.closeModal}
            buttons={this.state.modalData.buttons}
            menu={this.state.modalData.menu}
            defaultPosition={this.state.modalData.defaultPosition}
            hasWindowButton={this.state.modalData.hasWindowButton}
            positionOffset={{x: "40ch", y: "16px"}}
            style={this.state.modalData.style}
          >{this.state.modalData.content}</Modal></ThemeProvider> : null
        }
      </div>
    );
  }
}

export default Main;
