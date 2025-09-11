/**
 * typeCorrections.test.js
 * Comprehensive test suite for type corrections module
 * Tests all direct corrections and analyzer functionality
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { TYPE_CORRECTIONS, analyzeTypeErrors } from '../../src/test-engine/matchers/corrections/typeCorrections.js';

describe('Type Corrections Module', () => {
  describe('TYPE_CORRECTIONS - Direct Corrections', () => {
    describe('JavaScript capitalized types', () => {
      test('should correct capitalized JavaScript types', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:String'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Number'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Boolean'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Object'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Array'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Function'], 'match:type:function');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Undefined'], 'match:type:undefined');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Null'], 'match:type:null');
      });

      test('should handle JSON serialization types correctly', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Date'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Symbol'], 'match:type:string');
      });
    });

    describe('Programming language type aliases', () => {
      test('should correct common type aliases', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:str'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:int'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:integer'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:long'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:float'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:double'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:decimal'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:bool'], 'match:type:boolean');
      });

      test('should correct object type aliases', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:obj'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:dict'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:map'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:hash'], 'match:type:object');
      });

      test('should correct array type aliases', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:list'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:arr'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:vector'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:collection'], 'match:type:array');
      });
    });

    describe('Quoted type patterns', () => {
      test('should remove quotes from type patterns', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:"boolean"'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS["match:type:'boolean'"], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:"string"'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS["match:type:'string'"], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:"number"'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS["match:type:'number'"], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:"object"'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS["match:type:'object'"], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:"array"'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS["match:type:'array'"], 'match:type:array');
      });

      test('should correct quoted values with wrong format', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:"String"'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:"Number"'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:"Boolean"'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:"Object"'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:"Array"'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:"string"'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:"number"'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:"boolean"'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:"object"'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:"array"'], 'match:type:array');
      });
    });

    describe('Missing match: prefix', () => {
      test('should add missing match: prefix', () => {
        assert.strictEqual(TYPE_CORRECTIONS['type:string'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['type:number'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['type:boolean'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['type:object'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['type:array'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['type:function'], 'match:type:function');
        assert.strictEqual(TYPE_CORRECTIONS['type:undefined'], 'match:type:undefined');
        assert.strictEqual(TYPE_CORRECTIONS['type:null'], 'match:type:null');
      });

      test('should correct capitalized types without quotes', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:Number:'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:String:'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:Boolean:'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:Object:'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:Array:'], 'match:type:array');
      });
    });

    describe('typeof and instanceof confusion', () => {
      test('should correct typeof usage', () => {
        assert.strictEqual(TYPE_CORRECTIONS['typeof:string'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['typeof:number'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['typeof:boolean'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['typeof:object'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['typeof:function'], 'match:type:function');
        assert.strictEqual(TYPE_CORRECTIONS['typeof:undefined'], 'match:type:undefined');
      });

      test('should correct instanceof usage', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:instanceof:Array'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:instanceof:Object'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:instanceof:Date'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:instanceof:RegExp'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:instanceof:Error'], 'match:type:object');
      });
    });

    describe('TypeScript/Flow types', () => {
      test('should correct TypeScript specific types', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:any'], 'match:exists');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:void'], 'match:type:undefined');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:never'], 'match:not:exists');
      });
    });

    describe('Validation library patterns', () => {
      test('should correct validation library functions', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:isString'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:isNumber'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:isBoolean'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:isObject'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:isArray'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:isFunction'], 'match:type:function');
        assert.strictEqual(TYPE_CORRECTIONS['match:isDefined'], 'match:exists');
        assert.strictEqual(TYPE_CORRECTIONS['match:isUndefined'], 'match:type:undefined');
        assert.strictEqual(TYPE_CORRECTIONS['match:isNull'], 'match:type:null');
      });
    });

    describe('Common misspellings', () => {
      test('should correct common typing mistakes', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:strig'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:stirng'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:numbr'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:bolean'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:booleean'], 'match:type:boolean');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:objct'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:aray'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:arry'], 'match:type:array');
      });
    });

    describe('Language-specific types', () => {
      test('should correct Python types', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:List'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Dict'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Tuple'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Set'], 'match:type:array');
      });

      test('should correct Java types', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:ArrayList'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:HashMap'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Integer'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Double'], 'match:type:number');
      });

      test('should correct C# types', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:List<>'], 'match:type:array');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Dictionary'], 'match:type:object');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Int32'], 'match:type:number');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:Int64'], 'match:type:number');
      });

      test('should correct SQL types', () => {
        assert.strictEqual(TYPE_CORRECTIONS['match:type:varchar'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:text'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:char'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:nvarchar'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:datetime'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:timestamp'], 'match:type:string');
        assert.strictEqual(TYPE_CORRECTIONS['match:type:bigint'], 'match:type:number');
      });
    });

    test('should have comprehensive coverage of corrections', () => {
      const correctionCount = Object.keys(TYPE_CORRECTIONS).length;
      assert.ok(correctionCount >= 100, `Should have at least 100 corrections, found ${correctionCount}`);
    });
  });

  describe('analyzeTypeErrors - Pattern Analysis', () => {
    describe('Quoted type detection', () => {
      test('should detect quoted types with double quotes', () => {
        const suggestions = analyzeTypeErrors('match:type:"boolean"');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'quoted_type');
        assert.strictEqual(suggestions[0].corrected, 'match:type:boolean');
        assert.ok(suggestions[0].message.includes('should not be quoted'));
      });

      test('should detect quoted types with single quotes', () => {
        const suggestions = analyzeTypeErrors("match:type:'string'");
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'quoted_type');
        assert.strictEqual(suggestions[0].corrected, 'match:type:string');
      });

      test('should handle mixed quotes', () => {
        const suggestions = analyzeTypeErrors('match:type:"number\'');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].corrected, 'match:type:number');
      });
    });

    describe('Capitalized type detection', () => {
      test('should detect capitalized types', () => {
        const suggestions = analyzeTypeErrors('match:type:String');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'capitalized_type');
        assert.strictEqual(suggestions[0].corrected, 'match:type:string');
        assert.ok(suggestions[0].message.includes('lowercase'));
      });

      test('should detect all caps types', () => {
        const suggestions = analyzeTypeErrors('match:type:NUMBER');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'capitalized_type');
        assert.strictEqual(suggestions[0].corrected, 'match:type:number');
      });

      test('should detect mixed case types', () => {
        const suggestions = analyzeTypeErrors('match:type:Boolean');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].corrected, 'match:type:boolean');
      });
    });

    describe('Missing match: prefix detection', () => {
      test('should detect missing match: prefix', () => {
        const suggestions = analyzeTypeErrors('type:object');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'missing_match_prefix');
        assert.strictEqual(suggestions[0].corrected, 'match:type:object');
        assert.ok(suggestions[0].message.includes('must start with "match:"'));
      });

      test('should handle all basic types without prefix', () => {
        const types = ['string', 'number', 'boolean', 'object', 'array', 'function', 'undefined', 'null'];
        types.forEach(type => {
          const suggestions = analyzeTypeErrors(`type:${type}`);
          assert.strictEqual(suggestions.length, 1);
          assert.strictEqual(suggestions[0].corrected, `match:type:${type}`);
        });
      });
    });

    describe('typeof confusion detection', () => {
      test('should detect typeof usage', () => {
        const suggestions = analyzeTypeErrors('typeof:number');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'typeof_confusion');
        assert.strictEqual(suggestions[0].corrected, 'match:type:number');
        assert.ok(suggestions[0].message.includes('not JavaScript typeof operator'));
      });

      test('should handle all typeof cases', () => {
        const types = ['string', 'number', 'boolean', 'object', 'function', 'undefined'];
        types.forEach(type => {
          const suggestions = analyzeTypeErrors(`typeof:${type}`);
          assert.strictEqual(suggestions.length, 1);
          assert.strictEqual(suggestions[0].corrected, `match:type:${type}`);
        });
      });
    });

    describe('instanceof confusion detection', () => {
      test('should detect instanceof Array usage', () => {
        const suggestions = analyzeTypeErrors('match:instanceof:Array');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'instanceof_confusion');
        assert.strictEqual(suggestions[0].corrected, 'match:type:array');
        assert.ok(suggestions[0].message.includes('JSON serialization'));
      });

      test('should detect instanceof for other types', () => {
        const suggestions = analyzeTypeErrors('match:instanceof:Date');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].corrected, 'match:type:object');
      });

      test('should handle instanceof without match prefix', () => {
        const suggestions = analyzeTypeErrors('instanceof:Object');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].corrected, 'match:type:object');
      });
    });

    describe('Validation library pattern detection', () => {
      test('should detect isString patterns', () => {
        const suggestions = analyzeTypeErrors('isString');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].type, 'validation_library_pattern');
        assert.strictEqual(suggestions[0].corrected, 'match:type:string');
      });

      test('should detect isDefined patterns', () => {
        const suggestions = analyzeTypeErrors('isDefined');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].corrected, 'match:exists');
      });

      test('should handle match: prefix in validation patterns', () => {
        const suggestions = analyzeTypeErrors('match:isNumber');
        assert.strictEqual(suggestions.length, 1);
        assert.strictEqual(suggestions[0].corrected, 'match:type:number');
      });

      test('should handle all validation library functions', () => {
        const validationFunctions = ['isString', 'isNumber', 'isBoolean', 'isObject', 'isArray', 'isFunction'];
        validationFunctions.forEach(func => {
          const suggestions = analyzeTypeErrors(func);
          assert.strictEqual(suggestions.length, 1);
          assert.ok(suggestions[0].corrected.startsWith('match:type:'));
        });
      });
    });

    describe('Language-specific type detection', () => {
      test('should detect Python types', () => {
        const suggestions = analyzeTypeErrors('match:type:List');
        assert.ok(suggestions.length >= 1);
        const langSuggestion = suggestions.find(s => s.type === 'language_specific_type');
        assert.ok(langSuggestion);
        assert.strictEqual(langSuggestion.corrected, 'match:type:array');
        assert.ok(langSuggestion.message.includes('JSON/JavaScript context'));
      });

      test('should detect Java types', () => {
        const suggestions = analyzeTypeErrors('match:type:ArrayList');
        const langSuggestion = suggestions.find(s => s.type === 'language_specific_type');
        assert.ok(langSuggestion);
        assert.strictEqual(langSuggestion.corrected, 'match:type:array');
      });

      test('should detect SQL types', () => {
        const suggestions = analyzeTypeErrors('match:type:varchar');
        assert.ok(suggestions.length >= 1);
        const langSuggestion = suggestions.find(s => s.type === 'language_specific_type');
        assert.ok(langSuggestion);
        assert.strictEqual(langSuggestion.corrected, 'match:type:string');
      });

      test('should handle numeric SQL types', () => {
        const suggestions = analyzeTypeErrors('match:type:bigint');
        const langSuggestion = suggestions.find(s => s.type === 'language_specific_type');
        assert.ok(langSuggestion);
        assert.strictEqual(langSuggestion.corrected, 'match:type:number');
      });
    });

    describe('Spelling error detection', () => {
      test('should detect string misspellings', () => {
        const misspellings = ['strig', 'stirng'];
        misspellings.forEach(misspelling => {
          const suggestions = analyzeTypeErrors(`match:type:${misspelling}`);
          const spellingSuggestion = suggestions.find(s => s.type === 'spelling_error');
          assert.ok(spellingSuggestion);
          assert.strictEqual(spellingSuggestion.corrected, 'match:type:string');
          assert.ok(spellingSuggestion.message.includes('Spelling error'));
        });
      });

      test('should detect all documented misspellings', () => {
        const misspellings = {
          'strig': 'string', 'stirng': 'string', 'numbr': 'number',
          'bolean': 'boolean', 'booleean': 'boolean', 'objct': 'object',
          'aray': 'array', 'arry': 'array',
        };

        Object.entries(misspellings).forEach(([wrong, correct]) => {
          const suggestions = analyzeTypeErrors(`match:type:${wrong}`);
          const spellingSuggestion = suggestions.find(s => s.type === 'spelling_error');
          assert.ok(spellingSuggestion, `Should detect misspelling: ${wrong}`);
          assert.strictEqual(spellingSuggestion.corrected, `match:type:${correct}`);
        });
      });
    });

    describe('TypeScript/Flow type detection', () => {
      test('should detect TypeScript any type', () => {
        const suggestions = analyzeTypeErrors('match:type:any');
        const tsSuggestion = suggestions.find(s => s.type === 'typescript_any');
        assert.ok(tsSuggestion);
        assert.strictEqual(tsSuggestion.corrected, 'match:exists');
        assert.ok(tsSuggestion.message.includes('any'));
      });

      test('should detect TypeScript void type', () => {
        const suggestions = analyzeTypeErrors('match:type:void');
        const tsSuggestion = suggestions.find(s => s.type === 'typescript_void');
        assert.ok(tsSuggestion);
        assert.strictEqual(tsSuggestion.corrected, 'match:type:undefined');
        assert.ok(tsSuggestion.message.includes('void'));
      });

      test('should detect TypeScript never type', () => {
        const suggestions = analyzeTypeErrors('match:type:never');
        const tsSuggestion = suggestions.find(s => s.type === 'typescript_never');
        assert.ok(tsSuggestion);
        assert.strictEqual(tsSuggestion.corrected, 'match:not:exists');
        assert.ok(tsSuggestion.message.includes('never'));
      });
    });

    describe('JSON serialization info', () => {
      test('should provide JSON serialization info for Date', () => {
        const suggestions = analyzeTypeErrors('match:type:Date');
        const jsonSuggestion = suggestions.find(s => s.type === 'json_serialization_info');
        assert.ok(jsonSuggestion);
        assert.strictEqual(jsonSuggestion.corrected, 'match:type:object');
        assert.ok(jsonSuggestion.message.includes('JSON serialization'));
      });

      test('should provide JSON serialization info for RegExp', () => {
        const suggestions = analyzeTypeErrors('match:type:RegExp');
        const jsonSuggestion = suggestions.find(s => s.type === 'json_serialization_info');
        assert.ok(jsonSuggestion);
        assert.strictEqual(jsonSuggestion.corrected, 'match:type:object');
      });

      test('should provide JSON serialization info for Error', () => {
        const suggestions = analyzeTypeErrors('match:type:Error');
        const jsonSuggestion = suggestions.find(s => s.type === 'json_serialization_info');
        assert.ok(jsonSuggestion);
        assert.strictEqual(jsonSuggestion.corrected, 'match:type:object');
      });
    });

    describe('Multiple suggestion scenarios', () => {
      test('should provide multiple suggestions for complex cases', () => {
        const suggestions = analyzeTypeErrors('match:type:List');
        assert.ok(suggestions.length >= 2);
        
        const capsSuggestion = suggestions.find(s => s.type === 'capitalized_type');
        const langSuggestion = suggestions.find(s => s.type === 'language_specific_type');
        
        assert.ok(capsSuggestion);
        assert.ok(langSuggestion);
      });

      test('should handle quoted and capitalized together', () => {
        const suggestions = analyzeTypeErrors('match:type:"String"');
        assert.ok(suggestions.length >= 1);
        assert.strictEqual(suggestions[0].corrected, 'match:type:String');
      });
    });

    describe('Edge cases and non-matches', () => {
      test('should return empty array for valid patterns', () => {
        const validPatterns = [
          'match:type:string',
          'match:type:number',
          'match:type:boolean',
          'match:type:object',
          'match:type:array',
        ];

        validPatterns.forEach(pattern => {
          const suggestions = analyzeTypeErrors(pattern);
          assert.strictEqual(suggestions.length, 0, `Should not suggest corrections for valid pattern: ${pattern}`);
        });
      });

      test('should return empty array for non-type patterns', () => {
        const nonTypePatterns = [
          'match:contains:test',
          'match:startsWith:hello',
          'match:arrayLength:5',
          'not_a_pattern',
          'random_string',
        ];

        nonTypePatterns.forEach(pattern => {
          const suggestions = analyzeTypeErrors(pattern);
          assert.strictEqual(suggestions.length, 0, `Should not suggest corrections for non-type pattern: ${pattern}`);
        });
      });

      test('should handle empty and null inputs gracefully', () => {
        assert.strictEqual(analyzeTypeErrors('').length, 0);
        assert.strictEqual(analyzeTypeErrors(null).length, 0);
        assert.strictEqual(analyzeTypeErrors(undefined).length, 0);
      });

      test('should handle very long patterns', () => {
        const longPattern = `match:type:${'a'.repeat(1000)}`;
        const suggestions = analyzeTypeErrors(longPattern);
        assert.ok(Array.isArray(suggestions));
      });
    });

    describe('Suggestion structure validation', () => {
      test('should return properly structured suggestions', () => {
        const suggestions = analyzeTypeErrors('match:type:String');
        assert.ok(suggestions.length > 0);
        
        suggestions.forEach(suggestion => {
          assert.ok(suggestion.type);
          assert.ok(suggestion.original);
          assert.ok(suggestion.corrected);
          assert.ok(suggestion.pattern);
          assert.ok(suggestion.message);
          assert.strictEqual(typeof suggestion.type, 'string');
          assert.strictEqual(typeof suggestion.original, 'string');
          assert.strictEqual(typeof suggestion.corrected, 'string');
          assert.strictEqual(typeof suggestion.pattern, 'string');
          assert.strictEqual(typeof suggestion.message, 'string');
        });
      });

      test('should have consistent corrected and pattern fields', () => {
        const suggestions = analyzeTypeErrors('type:object');
        assert.ok(suggestions.length > 0);
        
        suggestions.forEach(suggestion => {
          assert.strictEqual(suggestion.corrected, suggestion.pattern);
        });
      });
    });
  });

  describe('Integration with Pattern System', () => {
    test('should work with real-world MCP patterns', () => {
      // Test patterns that might appear in actual MCP test files
      const mcpPatterns = [
        'match:type:String',        // Common capitalization mistake
        'type:array',               // Missing match: prefix
        'match:type:"object"',      // Quoted types
        'match:isArray',            // Validation library style
        'typeof:boolean',           // JavaScript typeof confusion
        'match:instanceof:Array',   // instanceof confusion
        'match:type:List',          // Python type confusion
        'match:type:strig',          // Common typo
      ];

      mcpPatterns.forEach(pattern => {
        const directCorrection = TYPE_CORRECTIONS[pattern];
        const analyzerSuggestions = analyzeTypeErrors(pattern);
        
        // Should have either direct correction or analyzer suggestions (or both)
        assert.ok(
          directCorrection || analyzerSuggestions.length > 0,
          `Pattern "${pattern}" should have either direct correction or analyzer suggestions`,
        );
      });
    });

    test('should provide helpful debug information', () => {
      const problematicPattern = 'match:type:String';
      const suggestions = analyzeTypeErrors(problematicPattern);
      
      assert.ok(suggestions.length > 0);
      assert.ok(suggestions[0].message.length > 20); // Should have meaningful message
      assert.ok(suggestions[0].corrected !== problematicPattern); // Should actually correct
    });
  });

  describe('Performance and Memory', () => {
    test('should handle large batches of corrections efficiently', () => {
      const startTime = Date.now();
      
      // Test 1000 corrections
      for (let i = 0; i < 1000; i++) {
        analyzeTypeErrors('match:type:String');
        TYPE_CORRECTIONS['match:type:String'];
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete in reasonable time (less than 1 second)
      assert.ok(duration < 1000, `Performance test took ${duration}ms, should be under 1000ms`);
    });

    test('should not leak memory with repeated calls', () => {
      // Test that repeated calls don't accumulate memory
      const initialMemory = process.memoryUsage().heapUsed;
      
      for (let i = 0; i < 100; i++) {
        analyzeTypeErrors('match:type:String');
      }
      
      // Force garbage collection if available (optional optimization)
      // Note: gc is not available in standard Node.js without --expose-gc flag
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be minimal (less than 1MB)
      assert.ok(memoryIncrease < 1024 * 1024, `Memory increased by ${memoryIncrease} bytes`);
    });
  });
});
