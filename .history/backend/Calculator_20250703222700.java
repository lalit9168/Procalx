import java.math.BigInteger;

public class Calculator {
    public static void main(String[] args) {
        String op = args[0];
        double a = 0;
        double b = 0;

        try {
            a = Double.parseDouble(args[1]);
            if (args.length > 2) {
                b = Double.parseDouble(args[2]);
            }
        } catch (Exception e) {
            System.out.println("Invalid number input");
            return;
        }

        switch (op.toLowerCase()) {
            case "add": printResult(a + b); break;
            case "sub": printResult(a - b); break;
            case "mul": printResult(a * b); break;
            case "div":
                if (b == 0) System.out.println("Error: divide by zero");
                else printResult(a / b);
                break;
            case "mod": printResult(a % b); break;
            case "pow":
                try {
                    BigInteger bigA = new BigInteger(String.valueOf((long)a));
                    BigInteger bigResult = bigA.pow((int)b);
                    System.out.println(bigResult);
                } catch (Exception e) {
                    System.out.println("Too large to compute");
                }
                break;
            case "sqrt":
                if (a < 0) System.out.println("Error: negative input");
                else printResult(Math.sqrt(a));
                break;
            case "fact":
                if (a < 0 || a != Math.floor(a)) {
                    System.out.println("Error: factorial requires non-negative integer");
                } else {
                    System.out.println(bigFactorial((int) a));
                }
                break;
            default: System.out.println("Invalid operation");
        }
    }

    public static BigInteger bigFactorial(int n) {
        BigInteger result = BigInteger.ONE;
        for (int i = 2; i <= n; i++) {
            result = result.multiply(BigInteger.valueOf(i));
        }
        return result;
    }

    public static void printResult(double result) {
        if (result == Math.floor(result)) System.out.println((long) result);
        else System.out.println(result);
    }
}
