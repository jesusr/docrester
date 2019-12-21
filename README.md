# docrester

An utility to convert a Postman collection json (v2, v2.1) to Swagger JSON.

## Usage

    ./docrester [options] <input_file>
    
    Opciones:
      --version, --vv  version of the document                              [boolean]
      --output, -o     path for the output file                             [string] 
                                                            [default: "swagger.json"]
      --domain, -d     url for host domain                                  [string]
      --base, -b       base path                                            [string]
      --contact, -c    contact info                                         [boolean]
      --help, -h       
    
    Ejemplos:
      docrester -o ./swagger.json -e ./test_environment.json ./test.json
      Creates a swagger json based in the test.json file including the test_environment variables.


