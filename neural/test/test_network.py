import unittest
from unittest.mock import Mock
import numpy as np
from lib.network import Network

class NetworkTest(unittest.TestCase):

    def setUp(self):
        self.network = Network(2, 2)

    def test_define_model(self):
        self.network.define_model()
        self.assertNotEqual(self.network.model, None)

    def test_single_prediction(self):
        array = np.array([[1, 2]])
        prediction = self.network.batch_prediction(array)
        self.assertEqual(self.network.no_actions, len(prediction[0]))

    def test_batch_prediction(self):
        array = np.array([[1, 2],[3, 4]])
        prediction = self.network.batch_prediction(array)
        self.assertEqual(len(array), len(prediction))

    def test_batch_train(self):
        training_inputs = np.array([[1, 2], [3, 4]])
        training_outputs = np.array([[0.1, 0.12], [0.323, 0.984]])
        self.network.model = Mock()
        self.network.batch_train(training_inputs, training_outputs)
        self.network.model.fit.assert_called()

    def test_save_and_load_model(self):
        self.network.define_model()
        first_prediction = self.network.batch_prediction(np.array([[1,1]]))
        self.network.save_network('saved_model')
        self.second_network = Network(2,2)
        self.second_network.load_network('saved_model')
        second_prediction = self.second_network.batch_prediction(np.array([[1,1]]))
        self.assertTrue((first_prediction == second_prediction).all())
