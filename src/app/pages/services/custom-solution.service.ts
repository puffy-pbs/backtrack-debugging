import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomSolutionService {

  public getFunctionInitAndGenerator(functionString: string, delimiter: string = '---'):
    { functionInit: string, generator: string } {
    if (functionString == null) {
      throw new Error('An Empty Input');
    }
    const delimiterPos = functionString.indexOf(delimiter);
    if (delimiterPos === -1) {
      throw new Error('No Delimiters Found');
    }
    const functionInit = functionString.substr(0, delimiterPos).trim();
    const generator = functionString.substr(delimiterPos + delimiter.length).trim();
    return {
      functionInit: functionInit,
      generator: generator,
    };
  }

  public getVariables(variablesStr: string): string[][] {
    const variablesStrAsArray = variablesStr.split('\n');
    const variables: string[][] = [];
    const buffer = [];
    const separator = '=';
    for (let variableStr of variablesStrAsArray) {
      variableStr = variableStr.replace(/,$/, '');
      const pos = variableStr.indexOf(separator);
      const variable = variableStr.substr(0, pos).trim();
      if (!variable) {
        continue;
      }
      let value = variableStr.substr(pos + 1).trim();
      const setVariables = Object.keys(buffer);
      const regExpValues = (setVariables.length) ? new RegExp('[^a-zA-Z]+(' + setVariables.join('|') + ')') : '';
      const inBufferValuesMatches = (regExpValues) ? value.match(regExpValues) : null;
      if (inBufferValuesMatches !== null) {
        value = value.replace(inBufferValuesMatches[1], buffer[inBufferValuesMatches[1]]);
      }
      const evaluatedValue = eval(value);
      buffer[variable] = evaluatedValue;
      variables.push([variable, evaluatedValue]);
    }

    return variables;
  }

  public getFunction(functionString: string): { generator: string, params: string } {
    const fncSearch = 'function';
    const funcStart = functionString.indexOf(fncSearch);
    if (funcStart === -1) {
      throw new Error('');
    }
    const isAFunction = (functionString[funcStart + fncSearch.length] !== '*');
    if (isAFunction) {
      functionString = functionString.replace(/function/, fncSearch + '*');
    }
    const funcTitleMatches = functionString.match(/function\* ([a-zA-Z]+)?/);
    const funcTitle = funcTitleMatches[1];
    const indexStartParentheses = functionString.indexOf('(');
    const indexEndParentheses = functionString.indexOf(')');
    const parameters = functionString.substring(indexStartParentheses, indexEndParentheses + 1);
    functionString = functionString.replace(/function(\*)* .+{/, '');
    const indexOfFunctionCall = functionString.lastIndexOf(funcTitle);
    const fncPartFirst = functionString.substr(0, indexOfFunctionCall);
    const generatorFnc = fncPartFirst + 'yield *' + 'this.act' +
      functionString.substr(indexOfFunctionCall + funcTitle.length);

    return {
      'generator': generatorFnc,
      'params': parameters,
    };
  }
}
