/**
 * Complete the function below.
 * DONOT MODIFY anything outside this function!
 */
 
function rearrange(elements, length) {
  return ``;
}

/////////////// Do not modify anything below this line ////////////////////
process.stdin.resume();
process.stdin.setEncoding('ascii');

let raw_input = '';

process.stdin.on('data', function (data) {
  raw_input += data;
});

process.stdin.on('end', () => {
  return process.stdout.write(
    rearrange.apply(null, preparedData())
  );

});


function preparedData() {
  const
    input = raw_input.split('\n'),
    L     = parseInt(input.shift(), 10);

  input.pop();

  return [input, L];
}