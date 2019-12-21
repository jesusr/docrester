# docrester

An utility to convert a Postman collection json (v2, v2.1) to Swagger JSON.

## Usage

    ./docrester [options] <input_file>
    
    Opciones:
      --version, --vv  version of the document                            [booleano]
      --output, -o     path for the output file
                                    [cadena de caracteres] [defecto: "swagger.json"]
      --domain, -d     url for host domain                    [cadena de caracteres]
      --base, -b       base path                              [cadena de caracteres]
      --contact, -c    contact info                                       [booleano]
      --help, -h       Muestra ayuda                                      [booleano]
    
    Ejemplos:
      docrester -o ./swagger.json -e            Creates a swagger json based in the
      ./test_environment.json ./test.json       test.json file including the
                                                test_environment variables.


