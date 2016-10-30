define(function() {
  function count(elem, length) {
    var res = $(elem).length === length;
    expect(res).toBe(true);
  }

  return {
    count: count
  };
});
