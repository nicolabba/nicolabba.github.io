import React, { CSSProperties, AnimationEvent } from 'react';
import styles from './TypedText.module.css'; // Import css modules stylesheet as styles

type Props = { text: String, style?: CSSProperties, onFinishedWriting?: () => {} }

class TypedText extends React.Component<Props> {
    width = this.props.text.length

    onAnimationEnd(event: AnimationEvent) {
        if (event.animationName == styles.typing && !!this.props.onFinishedWriting) {
            this.props.onFinishedWriting()
        }
    }
    render() {
        return <p
            className={styles.typedtext}
            style={{
                width: this.width + 'ch',
                animation: `${styles.typing} 2s steps(${this.width}), ${styles.blink} .5s step-end infinite alternate`,
                ...this.props.style
            }}
            onAnimationEnd={this.onAnimationEnd}
        >{this.props.text}</p>;
    }
}
export default TypedText