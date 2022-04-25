import './sudoku.css';
import React  from 'react';
import {Button, ThemeProvider} from "@react95/core";

type SudokuData = Array<Array<Array<number>>>

class Sudoku extends React.Component<any, {shownData: SudokuData, dataHistory: Array<SudokuData>, solving: boolean}> {

    constructor(props: any) {
        super(props)
        this.state = {
            shownData: Array.from({length: 9}, (_, index) => Array.from({length: 9}, (_, index) => [1, 2, 3, 4, 5, 6, 7, 8, 9])),
            dataHistory: [],
            solving: false
        }
        this.deepCopy = this.deepCopy.bind(this)
        this.getColumn = this.getColumn.bind(this)
        this.getRow = this.getRow.bind(this)
        this.hasError = this.hasError.bind(this)
        this.isSolved = this.isSolved.bind(this)
        this.onNumberSelected = this.onNumberSelected.bind(this)
        this.onBackClicked = this.onBackClicked.bind(this)
        this.solve = this.solve.bind(this)
    }

    componentDidMount() {
        // this.typeNextText()
    }

    deepCopy<T>(inObject: T): T {
        let outObject: any
        let key, value

        if (typeof inObject !== "object" || inObject === null) {
            return inObject // Return the value if inObject is not an object
        }

        // Create an array or object to hold the values
        outObject = Array.isArray(inObject) ? [] : {}

        for (key in inObject) {
            // @ts-ignore
            value = inObject[key]

            // Recursively (deep) copy for nested objects, including arrays
            outObject[key] = this.deepCopy(value)
        }

        return outObject
    }

    getColumn(index: number): number { return index % 3 }

    getRow(index: number): number { return Math.floor(index / 3) }

    hasError(data: SudokuData) { return data.findIndex(el => el.findIndex(el2 => el2.length === 0) !== -1) !== -1 }

    isSolved(data: SudokuData) { return data.findIndex(el => el.findIndex(el2 => el2.length !== 1) !== -1) === -1 }

    fixNumber(data: SudokuData, index1: number, index2: number, index3: number): boolean {
        let error = false
        const selectedValue = data[index1][index2][index3]
        data[index1][index2] = [selectedValue]

        // Operate in the square
        data[index1].forEach((element, innerIndex2) => {
            if (innerIndex2 !== index2) {
                const foundIndex = element.findIndex(it => it === selectedValue)
                if (foundIndex !== -1) {
                    element.splice(foundIndex, 1)
                    if (element.length === 1) {
                        this.fixNumber(data, index1, innerIndex2, 0)
                    } else if (element.length === 0) {
                        error = true
                    }
                }
            }
        })

        // Operate in rows and columns
        data.forEach((element1, innerIndex1) => {
            if (innerIndex1 !== index1 && (this.getRow(innerIndex1) === this.getRow(index1) || this.getColumn(innerIndex1) === this.getColumn(index1))) {
                element1.forEach((element2, innerIndex2) => {
                    if (this.getRow(innerIndex2) === this.getRow(index2) || this.getColumn(innerIndex2) === this.getColumn(index2)) {
                        const foundIndex = element2.findIndex(it => it === selectedValue)
                        if (foundIndex !== -1) {
                            element2.splice(foundIndex, 1)
                            if (element2.length === 1) {
                                this.fixNumber(data, innerIndex1, innerIndex2, 0)
                            } else if (element2.length === 0) {
                                error = true
                            }
                        }
                    }
                })
            }
        })

        this.setState({shownData: data})
        return error
    }

    onNumberSelected(data: SudokuData, index1: number, index2: number, index3: number): boolean {
        this.setState({ dataHistory: [...this.state.dataHistory, this.deepCopy(this.state.shownData)] })
        return this.fixNumber(data, index1, index2, index3)
    }

    onBackClicked() {
        this.setState({
            shownData: this.state.dataHistory[this.state.dataHistory.length - 1],
            dataHistory: this.state.dataHistory.slice(0, this.state.dataHistory.length - 1)
        })
    }

    onSolveClicked() {
        this.setState({
            solving: true,
            dataHistory: [...this.state.dataHistory, this.state.shownData]
        })
        this.solve(this.state.shownData).then(() => {
            this.setState({
                solving: false
            })
        })
    }

    async solve(data: SudokuData): Promise<boolean> {
        return await new Promise(resolve => {
            setTimeout(async () => {
                if (this.isSolved(data)) resolve(true)
                else if (this.hasError(data)) resolve(false)
                else {
                    let minElement: number[] | null = null;
                    let minIndexes: number[] = []
                    data.forEach((element1, index1) => {
                        element1.forEach((element2, index2) => {
                            if (element2.length > 1 && (minElement == null || element2.length < minElement.length)) {
                                minElement = element2
                                minIndexes = [index1, index2]
                            }
                        })
                    })
                    if (minElement == null) minElement = []

                    let solved = false
                    for (let index = 0; index < minElement.length; index++) {
                        if (!solved) {
                            let newData = this.deepCopy(data)
                            this.fixNumber(newData, minIndexes[0], minIndexes[1], index)
                            solved = await this.solve(newData)
                        }
                    }
                    resolve(solved)
                }
            }, 50)
        })
    }

    render() {
        return (
            <div>
                <div className="sudoku main-container">
                    {this.state.shownData.map((element, index) => {
                        return <div className="sudoku" key={index.toString()}>
                            {element.map((element2, index2) => {
                                return <div className="sudoku" key={index.toString() + index2.toString()}>
                                    {element2.map((element3, index3) => {
                                        return <div className="sudoku-option" key={index.toString() + index2.toString() + element3.toString()}
                                                    onClick={() => this.onNumberSelected(this.state.shownData, index, index2, index3)}>
                                            {element3}
                                        </div>
                                    })}
                                </div>
                            })}
                        </div>
                    })}
                </div>
                <ThemeProvider>
                    <Button disabled={this.state.dataHistory.length < 1 || this.state.solving} onClick={() => this.onBackClicked()} className="button">Back</Button>
                    <Button disabled={this.state.solving} onClick={() => this.onSolveClicked()} className="button">Solve</Button>
                </ThemeProvider>
            </div>
        );
    }
}

export default Sudoku;
