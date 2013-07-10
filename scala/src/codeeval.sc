object codeeval {
  def fizzbuzz(firstDivisor:Int, secondDivisor:Int, includedLimit:Int):String = {
  	def innerFizzBuzz(firstDivisor:Int, secondDivisor:Int, upperLimit:Int, firstValue:Int):String =
  		if (firstValue == upperLimit) ""
  		else
  			if (firstValue % (firstDivisor * secondDivisor) == 0) "FB ".concat(innerFizzBuzz(firstDivisor, secondDivisor, upperLimit, firstValue+1))
  			else if (firstValue % firstDivisor == 0 && firstValue % secondDivisor != 0) "F ".concat(innerFizzBuzz(firstDivisor, secondDivisor, upperLimit, firstValue+1))
  			else if (firstValue % secondDivisor == 0 && firstValue % firstDivisor != 0) "B ".concat(innerFizzBuzz(firstDivisor, secondDivisor, upperLimit, firstValue+1))
  			else firstValue.toString()+" ".concat(innerFizzBuzz(firstDivisor, secondDivisor, upperLimit, firstValue+1))
  	innerFizzBuzz(firstDivisor, secondDivisor, includedLimit+1, 1)
  }                                               //> fizzbuzz: (firstDivisor: Int, secondDivisor: Int, includedLimit: Int)String
                                                  //> res0: java.lang.String = 1 2 F 4 B F 7 8 F B
    


}