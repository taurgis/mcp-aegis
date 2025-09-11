import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { connect } from '../../src/index.js';

describe('Cross-Field Validation Programmatic Tests', () => {
  let client;

  beforeEach(async () => {
    client = await connect('./examples/data-patterns-server/server.config.json');
  });

  afterEach(async () => {
    if (client) {
      await client.disconnect();
    }
  });

  describe('Event Data Cross-Field Validation', () => {
    test('should validate event date relationships', async () => {
      const result = await client.callTool('get_crossfield_data', { scenario: 'event' });

      // Verify data structure
      assert.ok(result.startDate, 'Should have startDate');
      assert.ok(result.endDate, 'Should have endDate');
      assert.ok(result.registrationStart, 'Should have registrationStart');
      assert.ok(result.registrationEnd, 'Should have registrationEnd');

      // Verify date relationships
      const startDate = new Date(result.startDate);
      const endDate = new Date(result.endDate);
      const regStart = new Date(result.registrationStart);
      const regEnd = new Date(result.registrationEnd);

      assert.ok(startDate < endDate, 'Event start should be before end');
      assert.ok(regStart < regEnd, 'Registration start should be before end');
      assert.ok(regEnd <= startDate, 'Registration should end before event starts');

      // Verify participant constraints
      assert.ok(typeof result.minParticipants === 'number', 'minParticipants should be number');
      assert.ok(typeof result.maxParticipants === 'number', 'maxParticipants should be number');
      assert.ok(typeof result.currentParticipants === 'number', 'currentParticipants should be number');
      assert.ok(result.minParticipants <= result.currentParticipants, 'Current participants should meet minimum');
      assert.ok(result.currentParticipants <= result.maxParticipants, 'Current participants should not exceed maximum');
    });
  });

  describe('Pricing Data Cross-Field Validation', () => {
    test('should validate pricing relationships', async () => {
      const result = await client.callTool('get_crossfield_data', { scenario: 'pricing' });

      // Verify pricing structure
      assert.ok(typeof result.originalPrice === 'number', 'originalPrice should be number');
      assert.ok(typeof result.discountPrice === 'number', 'discountPrice should be number');
      assert.ok(typeof result.minPrice === 'number', 'minPrice should be number');
      assert.ok(typeof result.wholesalePrice === 'number', 'wholesalePrice should be number');
      assert.ok(typeof result.retailPrice === 'number', 'retailPrice should be number');
      assert.ok(typeof result.cost === 'number', 'cost should be number');

      // Verify pricing relationships
      assert.ok(result.discountPrice < result.originalPrice, 'Discount price should be less than original');
      assert.ok(result.discountPrice >= result.minPrice, 'Discount price should be above minimum');
      assert.ok(result.wholesalePrice < result.retailPrice, 'Wholesale should be less than retail');
      assert.ok(result.cost < result.wholesalePrice, 'Cost should be less than wholesale');
      assert.ok(result.originalPrice === result.retailPrice, 'Original price should equal retail price');
    });
  });

  describe('User Account Cross-Field Validation', () => {
    test('should validate user account constraints', async () => {
      const result = await client.callTool('get_crossfield_data', { scenario: 'user' });

      // Verify user data structure
      assert.ok(typeof result.age === 'number', 'age should be number');
      assert.ok(typeof result.minAge === 'number', 'minAge should be number');
      assert.ok(typeof result.maxAge === 'number', 'maxAge should be number');
      assert.ok(typeof result.accountBalance === 'number', 'accountBalance should be number');
      assert.ok(typeof result.creditLimit === 'number', 'creditLimit should be number');

      // Verify age constraints
      assert.ok(result.age >= result.minAge, 'Age should meet minimum requirement');
      assert.ok(result.age <= result.maxAge, 'Age should not exceed maximum');

      // Verify account constraints
      assert.ok(result.accountBalance <= result.creditLimit, 'Balance should not exceed credit limit');

      // Verify date relationships
      const lastLogin = new Date(result.lastLoginDate);
      const accountCreated = new Date(result.accountCreatedDate);
      const passwordChanged = new Date(result.passwordLastChanged);

      assert.ok(lastLogin > accountCreated, 'Last login should be after account creation');
      assert.ok(passwordChanged >= accountCreated, 'Password change should be after account creation');
    });
  });

  describe('Inventory Management Cross-Field Validation', () => {
    test('should validate inventory constraints', async () => {
      const result = await client.callTool('get_crossfield_data', { scenario: 'inventory' });

      // Verify inventory structure
      assert.ok(typeof result.currentStock === 'number', 'currentStock should be number');
      assert.ok(typeof result.minStock === 'number', 'minStock should be number');
      assert.ok(typeof result.maxStock === 'number', 'maxStock should be number');
      assert.ok(typeof result.availableStock === 'number', 'availableStock should be number');
      assert.ok(typeof result.reservedStock === 'number', 'reservedStock should be number');

      // Verify stock relationships
      assert.ok(result.currentStock > result.minStock, 'Current stock should be above minimum');
      assert.ok(result.currentStock <= result.maxStock, 'Current stock should not exceed maximum');
      assert.ok(result.availableStock <= result.currentStock, 'Available stock should not exceed current');
      assert.ok(result.availableStock >= 0, 'Available stock should be non-negative');

      // Verify date relationships
      const lastRestocked = new Date(result.lastRestocked);
      const nextDelivery = new Date(result.nextDelivery);

      assert.ok(nextDelivery > lastRestocked, 'Next delivery should be after last restock');
    });
  });

  describe('Financial Transaction Cross-Field Validation', () => {
    test('should validate financial constraints', async () => {
      const result = await client.callTool('get_crossfield_data', { scenario: 'financial' });

      // Verify financial structure
      assert.ok(typeof result.amount === 'number', 'amount should be number');
      assert.ok(typeof result.fee === 'number', 'fee should be number');
      assert.ok(typeof result.netAmount === 'number', 'netAmount should be number');
      assert.ok(typeof result.minAmount === 'number', 'minAmount should be number');
      assert.ok(typeof result.maxAmount === 'number', 'maxAmount should be number');

      // Verify amount relationships
      assert.ok(result.amount >= result.minAmount, 'Amount should meet minimum');
      assert.ok(result.amount <= result.maxAmount, 'Amount should not exceed maximum');
      assert.ok(result.netAmount < result.amount, 'Net amount should be less than gross amount');
      assert.ok(result.fee > 0, 'Fee should be positive');

      // Verify credit constraints
      assert.ok(result.creditScore >= result.minCreditScore, 'Credit score should meet minimum');
      assert.ok(result.debtToIncomeRatio <= result.maxDebtToIncomeRatio, 'Debt ratio should be within limits');
      assert.ok(result.debtToIncomeRatio >= 0, 'Debt ratio should be non-negative');
    });
  });

  describe('Multiple Tool Calls', () => {
    test('should maintain consistent data across calls', async () => {
      const event1 = await client.callTool('get_crossfield_data', { scenario: 'event' });
      const event2 = await client.callTool('get_crossfield_data', { scenario: 'event' });

      // Should return the same data structure (deterministic for testing)
      assert.deepEqual(event1, event2, 'Multiple calls should return consistent data');
    });

    test('should handle different scenarios correctly', async () => {
      const event = await client.callTool('get_crossfield_data', { scenario: 'event' });
      const pricing = await client.callTool('get_crossfield_data', { scenario: 'pricing' });
      const user = await client.callTool('get_crossfield_data', { scenario: 'user' });

      // Should have different data structures
      assert.ok(event.eventName && !pricing.eventName && !user.eventName, 'Event should have eventName');
      assert.ok(!event.originalPrice && pricing.originalPrice && !user.originalPrice, 'Pricing should have originalPrice');
      assert.ok(!event.username && !pricing.username && user.username, 'User should have username');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid scenario gracefully', async () => {
      const result = await client.callTool('get_crossfield_data', { scenario: 'invalid' });
      assert.ok(result.error, 'Should return error for invalid scenario');
      assert.equal(result.error, 'Unknown scenario', 'Should return appropriate error message');
    });

    test('should use default scenario when not specified', async () => {
      const result = await client.callTool('get_crossfield_data', {});
      assert.ok(result.eventName, 'Should default to event scenario');
      assert.ok(result.startDate, 'Should have event data fields');
    });
  });
});
