type="number"
                      name="tempMax"
                      id="tempMax"
                      value={formData.tempMax}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Humidity Range */}
              <div className="sm:col-span-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Humidity Range (%)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="humidityMin" className="block text-xs text-gray-500">
                      Minimum
                    </label>
                    <input
                      type="number"
                      name="humidityMin"
                      id="humidityMin"
                      value={formData.humidityMin}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="humidityOptimal" className="block text-xs text-gray-500">
                      Optimal
                    </label>
                    <input
                      type="number"
                      name="humidityOptimal"
                      id="humidityOptimal"
                      value={formData.humidityOptimal}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="humidityMax" className="block text-xs text-gray-500">
                      Maximum
                    </label>
                    <input
                      type="number"
                      name="humidityMax"
                      id="humidityMax"
                      value={formData.humidityMax}
                      onChange={handleChange}
                      className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial and Production Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Financial Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Cost and yield metrics.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="costPerKg" className="block text-sm font-medium text-gray-700">
                  Seed Cost ($/kg)
                </label>
                <input
                  type="number"
                  name="costPerKg"
                  id="costPerKg"
                  min="0"
                  step="0.01"
                  value={formData.costPerKg}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="pricePerGram" className="block text-sm font-medium text-gray-700">
                  Market Price ($/g)
                </label>
                <input
                  type="number"
                  name="pricePerGram"
                  id="pricePerGram"
                  min="0"
                  step="0.01"
                  value={formData.pricePerGram}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="expectedYieldPerTray" className="block text-sm font-medium text-gray-700">
                  Expected Yield (g/tray)
                </label>
                <input
                  type="number"
                  name="expectedYieldPerTray"
                  id="expectedYieldPerTray"
                  min="0"
                  step="0.1"
                  value={formData.expectedYieldPerTray}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="otherCostsPerTray" className="block text-sm font-medium text-gray-700">
                  Other Costs ($/tray)
                </label>
                <input
                  type="number"
                  name="otherCostsPerTray"
                  id="otherCostsPerTray"
                  min="0"
                  step="0.01"
                  value={formData.otherCostsPerTray}
                  onChange={handleChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Notes</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Additional information or growing tips.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <textarea
              name="notes"
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter any additional notes, observations, or growing tips for this variety..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Variety'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VarietyForm;
