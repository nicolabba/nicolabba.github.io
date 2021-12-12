import React, { CSSProperties, AnimationEvent } from 'react';
import styles from './TypedText.module.css'; // Import css modules stylesheet as styles

type Props = { numberKey: number, shownCursorKey: number, text: String, style?: CSSProperties, onFinishedWriting?: () => void }

class TypedText extends React.Component<Props> {
    width = this.props.text.length
    
    constructor(props: Props) {
        super(props)
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
    }

    render() {
        return <p
            className={styles.typedtext}
            style={{
                width: this.width + 'ch',
                animation: `${styles.typing} ${this.width / 13}s steps(${this.width}), ${styles.blink} .5s step-end infinite alternate`,
                borderRight: this.props.numberKey === this.props.shownCursorKey ? `3px solid` : '0px solid',
                ...this.props.style
            }}
            onAnimationEnd={this.onAnimationEnd}
        >{this.props.text}</p>;
    }

    onAnimationEnd(event: AnimationEvent) {
        if (!!event && event.animationName === styles.typing && !!this.props.onFinishedWriting) {
            this.props.onFinishedWriting()
        }
    }
}
export default TypedText