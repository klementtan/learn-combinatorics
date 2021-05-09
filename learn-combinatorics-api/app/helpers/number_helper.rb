# frozen_string_literal: true

module NumberHelper
  def simplify_fraction(numerator, denominator)
    numerator = numerator.to_i
    denominator = denominator.to_i
    raise InvalidParamsError, 'Denomiator cannot be 0' if denominator.zero?

    gcd = numerator.gcd(denominator)
    numerator /= gcd
    denominator /= gcd

    fraction = OpenStruct.new
    fraction.numerator = numerator
    fraction.denominator = denominator
    fraction
  end
end
